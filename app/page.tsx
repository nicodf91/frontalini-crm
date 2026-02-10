"use client"

import { useMemo } from "react"
import { useCRM } from "@/lib/crm-context"
import { Users, Building2, Bell, CalendarCheck } from "lucide-react"

const MS_PER_DAY = 24 * 60 * 60 * 1000

function formatRelativeLabel(dateStr: string, time?: string) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  const today = new Date()
  const baseToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const baseDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((baseDate.getTime() - baseToday.getTime()) / MS_PER_DAY)
  const timePart = time ? ` ${time}` : ""

  if (diffDays === 0) return `Hoy${timePart}`
  if (diffDays === 1) return `Mañana${timePart}`
  if (diffDays === -1) return `Ayer${timePart}`
  if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`
  return `En ${diffDays} días`
}

export default function DashboardPage() {
  const { leads, propiedades, alertas, eventos } = useCRM()

  const leadsActivos = leads.filter((l) => l.estado !== "Cerrado" && l.estado !== "Perdido").length
  const alertasPendientes = alertas.filter((a) => !a.resuelta).length
  const hoy = new Date().toISOString().split("T")[0]
  const seguimientosHoy = eventos.filter((e) => e.fecha === hoy).length

  const stats = [
    { label: "Leads Activos", value: leadsActivos, icon: Users },
    { label: "Propiedades", value: propiedades.length, icon: Building2 },
    { label: "Alertas Pendientes", value: alertasPendientes, icon: Bell },
    { label: "Seguimientos Hoy", value: seguimientosHoy, icon: CalendarCheck },
  ]

  const actividadReciente = useMemo(() => {
    const alertItems = alertas.map((a) => ({
      id: `alerta-${a.id}`,
      sortKey: `${a.fecha}T00:00`,
      text:
        a.tipo === "retasacion"
          ? `Retasación: ${a.propiedadCodigo} · ${a.leadNombre}`
          : `Match: ${a.leadNombre} · ${a.propiedadCodigo}`,
      time: formatRelativeLabel(a.fecha),
    }))

    const eventItems = eventos.map((e) => {
      const target = e.leadNombre || e.propiedadCodigo || e.titulo
      return {
        id: `evento-${e.id}`,
        sortKey: `${e.fecha}T${e.hora || "00:00"}`,
        text: `Evento ${e.tipo}${target ? ` · ${target}` : ""}`,
        time: formatRelativeLabel(e.fecha, e.hora),
      }
    })

    return [...alertItems, ...eventItems].sort((a, b) => b.sortKey.localeCompare(a.sortKey)).slice(0, 3)
  }, [alertas, eventos])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <stat.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold text-card-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-card-foreground">
          Ultimos Eventos
        </h2>
        <div className="flex flex-col gap-3">
          {actividadReciente.length === 0 ? (
            <div className="rounded-lg bg-muted/50 px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Aún no hay actividad reciente.
              </p>
            </div>
          ) : (
            actividadReciente.map((evento) => (
              <div
                key={evento.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
              >
                <p className="text-sm text-card-foreground">{evento.text}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{evento.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
