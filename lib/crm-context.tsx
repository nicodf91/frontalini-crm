"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import { toast } from "sonner"
import type {
  Lead, Propiedad, DemandaActiva, Alerta, Evento,
  LeadEstado, Canal, Presupuesto, TipoPropiedad, TipoEvento,
} from "./store"
import {
  initialLeads, initialPropiedades, initialDemandas,
  initialAlertas, initialEventos,
  presupuestoCompatible, zonaCompatible,
} from "./store"

interface CRMContextType {
  leads: Lead[]
  propiedades: Propiedad[]
  demandas: DemandaActiva[]
  alertas: Alerta[]
  eventos: Evento[]
  addLead: (lead: Omit<Lead, "id">) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  addPropiedad: (prop: Omit<Propiedad, "id">) => void
  updatePropiedad: (id: string, updates: Partial<Propiedad>) => void
  retasarPropiedad: (id: string, nuevoPrecio: number) => void
  addDemanda: (demanda: Omit<DemandaActiva, "id">) => void
  resolverAlerta: (id: string) => void
  addEvento: (evento: Omit<Evento, "id">) => void
  updateEvento: (id: string, updates: Partial<Evento>) => void
  removeEvento: (id: string) => void
  moveLeadEstado: (id: string, estado: LeadEstado) => void
}

const CRMContext = createContext<CRMContextType | null>(null)

function alertKey(alerta: Pick<Alerta, "tipo" | "leadId" | "propiedadId" | "mensaje">) {
  return `${alerta.tipo}|${alerta.leadId}|${alerta.propiedadId}|${alerta.mensaje}`
}

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [propiedades, setPropiedades] = useState<Propiedad[]>(initialPropiedades)
  const [demandas, setDemandas] = useState<DemandaActiva[]>(initialDemandas)
  const [alertas, setAlertas] = useState<Alerta[]>(initialAlertas)
  const [eventos, setEventos] = useState<Evento[]>(initialEventos)
  const alertKeysRef = useRef(new Set(initialAlertas.map((a) => alertKey(a))))

  const pushAlerta = useCallback((alerta: Alerta, toastTitle: string) => {
    const key = alertKey(alerta)
    setAlertas((prev) => {
      if (alertKeysRef.current.has(key)) return prev
      alertKeysRef.current.add(key)
      toast(toastTitle, { description: alerta.mensaje })
      return [...prev, alerta]
    })
  }, [])

  const addLead = useCallback((lead: Omit<Lead, "id">) => {
    const newLead: Lead = { ...lead, id: `l${Date.now()}` }
    setLeads((prev) => [...prev, newLead])

    if (
      newLead.tipoContacto === "Comprador" &&
      newLead.estado !== "Cerrado" &&
      newLead.estado !== "Perdido"
    ) {
      propiedades.forEach((prop) => {
        if (
          newLead.tipoBuscado === prop.tipo &&
          zonaCompatible(newLead.zona, prop.zona) &&
          presupuestoCompatible(newLead.presupuesto ?? "A definir", prop.precio)
        ) {
          const msg = `La propiedad ${prop.codigo} (${prop.tipo} en ${prop.zona}, USD ${prop.precio.toLocaleString()}) coincide con la búsqueda de ${newLead.nombre}.`
          const newAlerta: Alerta = {
            id: `a${Date.now()}-${prop.id}`,
            tipo: "match",
            leadId: newLead.id,
            leadNombre: newLead.nombre,
            propiedadId: prop.id,
            propiedadCodigo: prop.codigo,
            mensaje: msg,
            resuelta: false,
            fecha: new Date().toISOString().split("T")[0],
          }
          pushAlerta(newAlerta, "Coincidencia detectada")
        }
      })
    }
  }, [propiedades, pushAlerta])

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }, [])

  const moveLeadEstado = useCallback((id: string, estado: LeadEstado) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, estado } : l)))
  }, [])

  const addPropiedad = useCallback((prop: Omit<Propiedad, "id">) => {
    const newProp: Propiedad = { ...prop, id: `p${Date.now()}` }
    setPropiedades((prev) => [...prev, newProp])

    // Check for matching leads (Compradores only) based on tipoBuscado, zona, presupuesto
    leads.forEach((lead) => {
      if (
        lead.tipoContacto === "Comprador" &&
        lead.estado !== "Cerrado" &&
        lead.estado !== "Perdido" &&
        lead.tipoBuscado === prop.tipo &&
        zonaCompatible(lead.zona, prop.zona) &&
        presupuestoCompatible(lead.presupuesto ?? "A definir", prop.precio)
      ) {
        const msg = `Nueva propiedad ${prop.codigo} (${prop.tipo} en ${prop.zona}, USD ${prop.precio.toLocaleString()}) coincide con la búsqueda de ${lead.nombre}.`
        const newAlerta: Alerta = {
          id: `a${Date.now()}-${lead.id}`,
          tipo: "match",
          leadId: lead.id,
          leadNombre: lead.nombre,
          propiedadId: newProp.id,
          propiedadCodigo: prop.codigo,
          mensaje: msg,
          resuelta: false,
          fecha: new Date().toISOString().split("T")[0],
        }
        pushAlerta(newAlerta, "Coincidencia detectada")
      }
    })

    // Also check demands
    demandas.forEach((d) => {
      if (
        d.estado === "Activa" &&
        d.tipo === prop.tipo &&
        zonaCompatible(d.zona, prop.zona) &&
        presupuestoCompatible(d.presupuesto, prop.precio)
      ) {
        // Avoid duplicate alert if lead already matched
        const alreadyMatched = leads.some(
          (l) => l.id === d.clienteId && l.tipoContacto === "Comprador" && l.tipoBuscado === prop.tipo && zonaCompatible(l.zona, prop.zona)
        )
        if (!alreadyMatched) {
          const msg = `Nueva propiedad ${prop.codigo} (${prop.tipo} en ${prop.zona}, USD ${prop.precio.toLocaleString()}) coincide con la demanda de ${d.clienteNombre}.`
          const newAlerta: Alerta = {
            id: `a${Date.now()}-${d.id}`,
            tipo: "match",
            leadId: d.clienteId,
            leadNombre: d.clienteNombre,
            propiedadId: newProp.id,
            propiedadCodigo: prop.codigo,
            mensaje: msg,
            resuelta: false,
            fecha: new Date().toISOString().split("T")[0],
          }
          pushAlerta(newAlerta, "Coincidencia detectada")
        }
      }
    })
  }, [leads, demandas, pushAlerta])

  const updatePropiedad = useCallback((id: string, updates: Partial<Propiedad>) => {
    const { historialPrecios, ...rest } = updates
    setPropiedades((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...rest, historialPrecios: historialPrecios ?? p.historialPrecios }
          : p
      )
    )
  }, [])

  const retasarPropiedad = useCallback((id: string, nuevoPrecio: number) => {
    setPropiedades((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const oldPrecio = p.precio
        const updated = {
          ...p,
          precio: nuevoPrecio,
          historialPrecios: [...p.historialPrecios, { precio: nuevoPrecio, fecha: new Date().toISOString().split("T")[0] }],
        }

        // Generate retasacion alerts for matching leads (Compradores only)
        const matchedLeadIds = new Set<string>()
        leads.forEach((lead) => {
          if (
            lead.tipoContacto === "Comprador" &&
            lead.estado !== "Cerrado" &&
            lead.estado !== "Perdido" &&
            lead.tipoBuscado === p.tipo &&
            zonaCompatible(lead.zona, p.zona) &&
            presupuestoCompatible(lead.presupuesto ?? "A definir", nuevoPrecio)
          ) {
            matchedLeadIds.add(lead.id)
            const msg = `La propiedad ${p.codigo} fue retasada de USD ${oldPrecio.toLocaleString()} a USD ${nuevoPrecio.toLocaleString()}. Podría interesarle a ${lead.nombre}.`
            const newAlerta: Alerta = {
              id: `a${Date.now()}-${lead.id}`,
              tipo: "retasacion",
              leadId: lead.id,
              leadNombre: lead.nombre,
              propiedadId: p.id,
              propiedadCodigo: p.codigo,
              mensaje: msg,
              resuelta: false,
              fecha: new Date().toISOString().split("T")[0],
            }
            pushAlerta(newAlerta, "Retasacion - Posible interes")
          }
        })

        // Also check demands for leads not already matched
        demandas.forEach((d) => {
          if (
            d.estado === "Activa" &&
            d.tipo === p.tipo &&
            zonaCompatible(d.zona, p.zona) &&
            presupuestoCompatible(d.presupuesto, nuevoPrecio) &&
            !matchedLeadIds.has(d.clienteId)
          ) {
            const msg = `La propiedad ${p.codigo} fue retasada de USD ${oldPrecio.toLocaleString()} a USD ${nuevoPrecio.toLocaleString()}. Podría interesarle a ${d.clienteNombre}.`
            const newAlerta: Alerta = {
              id: `a${Date.now()}-${d.id}`,
              tipo: "retasacion",
              leadId: d.clienteId,
              leadNombre: d.clienteNombre,
              propiedadId: p.id,
              propiedadCodigo: p.codigo,
              mensaje: msg,
              resuelta: false,
              fecha: new Date().toISOString().split("T")[0],
            }
            pushAlerta(newAlerta, "Retasacion - Posible interes")
          }
        })

        return updated
      })
    )
  }, [leads, demandas, pushAlerta])

  const addDemanda = useCallback((demanda: Omit<DemandaActiva, "id">) => {
    setDemandas((prev) => [...prev, { ...demanda, id: `d${Date.now()}` }])
  }, [])

  const resolverAlerta = useCallback((id: string) => {
    setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, resuelta: true } : a)))
  }, [])

  const addEvento = useCallback((evento: Omit<Evento, "id">) => {
    const newEvento: Evento = { ...evento, id: `e${Date.now()}` }
    setEventos((prev) => [...prev, newEvento])

    // Update lead's próximo paso if lead is linked
    if (evento.leadId) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === evento.leadId
            ? { ...l, proximoPaso: `${evento.tipo} - ${evento.fecha} ${evento.hora}` }
            : l
        )
      )
    }
  }, [])

  const updateEvento = useCallback((id: string, updates: Partial<Evento>) => {
    let updated: Evento | null = null
    setEventos((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        updated = { ...e, ...updates }
        return updated
      })
    )

    if (updated?.leadId) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === updated!.leadId
            ? { ...l, proximoPaso: `${updated!.tipo} - ${updated!.fecha} ${updated!.hora}` }
            : l
        )
      )
    }
  }, [])

  const removeEvento = useCallback((id: string) => {
    setEventos((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return (
    <CRMContext.Provider
      value={{
        leads, propiedades, demandas, alertas, eventos,
        addLead, updateLead, addPropiedad, updatePropiedad, retasarPropiedad,
        addDemanda, resolverAlerta, addEvento, updateEvento, removeEvento, moveLeadEstado,
      }}
    >
      {children}
    </CRMContext.Provider>
  )
}

export function useCRM() {
  const ctx = useContext(CRMContext)
  if (!ctx) throw new Error("useCRM must be used within CRMProvider")
  return ctx
}
