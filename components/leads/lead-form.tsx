"use client"

import React from "react"

import { useState } from "react"
import { useCRM } from "@/lib/crm-context"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type {
  Canal,
  LeadEstado,
  Presupuesto,
  TipoPropiedad,
  TipoContacto,
  MotivoContacto,
} from "@/lib/store"

const canales: Canal[] = ["WhatsApp", "Mercado Libre", "Instagram", "Facebook"]
const tiposPropiedad: TipoPropiedad[] = [
  "Casa",
  "Departamento",
  "Lote",
  "Casa Quinta",
  "Comercio",
  "Otro",
]
const presupuestos: Presupuesto[] = [
  "Hasta USD 50.000",
  "USD 50.000 – 100.000",
  "USD 100.000 – 200.000",
  "Más de USD 200.000",
  "A definir",
]
const motivos: MotivoContacto[] = ["Venta", "Tasación", "Consulta general"]
const estados: LeadEstado[] = [
  "Nuevo",
  "Interesado",
  "Visitó",
  "Negociación",
  "Cerrado",
  "Perdido",
]

export function LeadForm({ onClose }: { onClose: () => void }) {
  const { addLead } = useCRM()
  const [tipoContacto, setTipoContacto] = useState<TipoContacto>("Comprador")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [canal, setCanal] = useState<Canal>("WhatsApp")
  const [zona, setZona] = useState("")
  const [estado, setEstado] = useState<LeadEstado>("Nuevo")
  const [proximoPaso, setProximoPaso] = useState("")
  // Comprador
  const [tipoBuscado, setTipoBuscado] = useState<TipoPropiedad>("Departamento")
  const [presupuesto, setPresupuesto] = useState<Presupuesto>("A definir")
  // Propietario
  const [tipoOfrece, setTipoOfrece] = useState<TipoPropiedad>("Casa")
  const [motivoContacto, setMotivoContacto] = useState<MotivoContacto>("Venta")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) return

    if (tipoContacto === "Comprador") {
      addLead({
        tipoContacto,
        nombre,
        telefono,
        canal,
        tipoBuscado,
        zona,
        presupuesto,
        estado,
        proximoPaso,
      })
    } else {
      addLead({
        tipoContacto,
        nombre,
        telefono,
        canal,
        tipoOfrece,
        zona,
        motivoContacto,
        estado,
        proximoPaso,
      })
    }
    onClose()
  }

  const inputClass =
    "rounded-lg border border-input bg-[#FFFFFF] px-3 py-2 text-sm text-[#111111] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-card-foreground">
          Nuevo Lead
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
          aria-label="Cerrar formulario"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Tipo de contacto - segmented control */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">
            Tipo de contacto
          </label>
          <div className="flex rounded-lg border border-input bg-muted/40 p-0.5">
            {(["Comprador", "Propietario"] as TipoContacto[]).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setTipoContacto(tipo)}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  tipoContacto === tipo
                    ? "bg-card text-card-foreground shadow-sm"
                    : "text-muted-foreground hover:text-card-foreground"
                }`}
              >
                {tipo}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-card-foreground">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Perez"
              className={inputClass}
              required
            />
          </div>

          {/* Telefono */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-card-foreground">
              Telefono
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: +54 11 1234 5678"
              className={inputClass}
            />
          </div>

          {/* Canal de ingreso */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-card-foreground">
              Canal de ingreso
            </label>
            <select
              value={canal}
              onChange={(e) => setCanal(e.target.value as Canal)}
              className={inputClass}
            >
              {canales.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional fields based on tipoContacto */}
          {tipoContacto === "Comprador" ? (
            <>
              {/* Tipo de propiedad buscada */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Tipo de propiedad buscada
                </label>
                <select
                  value={tipoBuscado}
                  onChange={(e) =>
                    setTipoBuscado(e.target.value as TipoPropiedad)
                  }
                  className={inputClass}
                  required
                >
                  {tiposPropiedad.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Permite mejorar la coincidencia con propiedades disponibles.
                </p>
              </div>

              {/* Zona */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Zona de interes
                </label>
                <input
                  type="text"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  placeholder="Ej: Zona Norte, Centro, Barrio cerrado"
                  className={inputClass}
                />
              </div>

              {/* Presupuesto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Presupuesto estimado
                </label>
                <select
                  value={presupuesto}
                  onChange={(e) =>
                    setPresupuesto(e.target.value as Presupuesto)
                  }
                  className={inputClass}
                >
                  {presupuestos.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Tipo de propiedad que ofrece */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Tipo de propiedad que ofrece
                </label>
                <select
                  value={tipoOfrece}
                  onChange={(e) =>
                    setTipoOfrece(e.target.value as TipoPropiedad)
                  }
                  className={inputClass}
                  required
                >
                  {tiposPropiedad.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Zona */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Zona
                </label>
                <input
                  type="text"
                  value={zona}
                  onChange={(e) => setZona(e.target.value)}
                  placeholder="Ej: Zona Norte, Centro"
                  className={inputClass}
                />
              </div>

              {/* Motivo de contacto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Motivo de contacto
                </label>
                <select
                  value={motivoContacto}
                  onChange={(e) =>
                    setMotivoContacto(e.target.value as MotivoContacto)
                  }
                  className={inputClass}
                >
                  {motivos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Estado comercial */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-card-foreground">
              Estado comercial
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as LeadEstado)}
              className={inputClass}
            >
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* Proximo paso */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-card-foreground">
              Proximo paso
            </label>
            <input
              type="text"
              value={proximoPaso}
              onChange={(e) => setProximoPaso(e.target.value)}
              placeholder="Ej: Llamar lunes 10:00"
              className={inputClass}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit">Guardar Lead</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
