"use client"

import React from "react"

import { useState } from "react"
import { useCRM } from "@/lib/crm-context"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Evento, TipoEvento } from "@/lib/store"

const tiposEvento: TipoEvento[] = ["Visita", "Tasación", "Reunión", "Seguimiento"]

export function EventoForm({
  defaultDate,
  evento,
  onClose,
}: {
  defaultDate: string
  evento?: Evento
  onClose: () => void
}) {
  const { leads, propiedades, addEvento, updateEvento } = useCRM()
  const isEdit = Boolean(evento)
  const [tipo, setTipo] = useState<TipoEvento>(evento?.tipo ?? "Visita")
  const [fecha, setFecha] = useState(evento?.fecha ?? defaultDate)
  const [hora, setHora] = useState(evento?.hora ?? "10:00")
  const [duracion, setDuracion] = useState(evento?.duracion ?? "1 hora")
  const [leadId, setLeadId] = useState(evento?.leadId ?? "")
  const [propiedadId, setPropiedadId] = useState(evento?.propiedadId ?? "")
  const [ubicacion, setUbicacion] = useState(evento?.ubicacion ?? "")
  const [notas, setNotas] = useState(evento?.notas ?? "")
  const [recordatorio, setRecordatorio] = useState(evento?.recordatorio ?? true)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const selectedLead = leads.find((l) => l.id === leadId)
    const selectedProp = propiedades.find((p) => p.id === propiedadId)
    const payload = {
      titulo: tipo,
      tipo,
      fecha,
      hora,
      duracion,
      leadId,
      leadNombre: selectedLead?.nombre || "",
      propiedadId,
      propiedadCodigo: selectedProp?.codigo || "",
      ubicacion,
      notas,
      recordatorio,
    }
    if (isEdit && evento) {
      updateEvento(evento.id, payload)
    } else {
      addEvento(payload)
    }
    onClose()
  }

  const inputClass =
    "rounded-lg border border-input bg-[#FFFFFF] px-3 py-2 text-sm text-[#111111] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-card-foreground">
          {isEdit ? "Editar Evento" : "Agendar Evento"}
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoEvento)}
            className={inputClass}
          >
            {tiposEvento.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">Duracion</label>
          <select
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
            className={inputClass}
          >
            <option value="15 min">15 min</option>
            <option value="30 min">30 min</option>
            <option value="45 min">45 min</option>
            <option value="1 hora">1 hora</option>
            <option value="2 horas">2 horas</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">Lead</label>
          <select
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className={inputClass}
          >
            <option value="">Sin asignar</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">Propiedad</label>
          <select
            value={propiedadId}
            onChange={(e) => setPropiedadId(e.target.value)}
            className={inputClass}
          >
            <option value="">Sin asignar</option>
            {propiedades.map((p) => (
              <option key={p.id} value={p.id}>{p.codigo} - {p.zona}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">Ubicacion</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ej: Oficina central"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-card-foreground">Recordatorio</label>
          <div className="flex h-[38px] items-center">
            <label className="flex items-center gap-2 text-sm text-card-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={recordatorio}
                onChange={(e) => setRecordatorio(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Activar recordatorio
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-card-foreground">Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas adicionales..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <Button type="submit">{isEdit ? "Guardar cambios" : "Guardar Evento"}</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
