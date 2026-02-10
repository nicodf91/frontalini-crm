"use client"

import { useState, useMemo } from "react"
import { useCRM } from "@/lib/crm-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Plus, Clock, Info, Pencil, Trash2 } from "lucide-react"
import { EventoForm } from "@/components/calendario/evento-form"

const DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1 // Monday = 0
}

export default function CalendarioPage() {
  const { eventos, removeEvento } = useCRM()
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  )
  const [showForm, setShowForm] = useState(false)
  const [editEventId, setEditEventId] = useState<string | null>(null)

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const eventsByDate = useMemo(() => {
    const map: Record<string, typeof eventos> = {}
    for (const e of eventos) {
      if (!map[e.fecha]) map[e.fecha] = []
      map[e.fecha].push(e)
    }
    return map
  }, [eventos])

  const selectedEvents = useMemo(() => {
    const list = eventsByDate[selectedDate] || []
    return [...list].sort((a, b) => (a.hora || "").localeCompare(b.hora || ""))
  }, [eventsByDate, selectedDate])

  const editEvent = editEventId
    ? eventos.find((e) => e.id === editEventId) ?? null
    : null

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  function goToday() {
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
    setSelectedDate(today.toISOString().split("T")[0])
  }

  function handleOpenNew() {
    setEditEventId(null)
    setShowForm(true)
  }

  function handleEdit(id: string) {
    setShowForm(false)
    setEditEventId(id)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditEventId(null)
  }

  function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar este evento? Esta acción no se puede deshacer.")) return
    removeEvento(id)
    if (editEventId === id) {
      setEditEventId(null)
    }
  }

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Calendar grid */}
        <div className="flex-1 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-card-foreground">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToday}>
                Hoy
              </Button>
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px">
            {DAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="p-2" />
              }
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const isToday = dateStr === today.toISOString().split("T")[0]
              const isSelected = dateStr === selectedDate
              const hasEvents = !!eventsByDate[dateStr]

              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    "relative flex h-10 items-center justify-center rounded-lg text-sm transition-colors",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : isToday
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-card-foreground hover:bg-muted"
                  )}
                >
                  {day}
                  {hasEvents && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-80">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">
                Eventos del dia
              </h3>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={handleOpenNew}
              >
                <Plus className="h-3.5 w-3.5" />
                Agendar
              </Button>
            </div>

            {selectedEvents.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No hay eventos para este dia.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {selectedEvents.map((evento) => (
                  <div
                    key={evento.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {evento.tipo}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {evento.hora}
                          {evento.duracion ? ` - ${evento.duracion}` : ""}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            type="button"
                            onClick={() => handleEdit(evento.id)}
                            aria-label="Editar evento"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            type="button"
                            onClick={() => handleDelete(evento.id)}
                            aria-label="Eliminar evento"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {evento.leadNombre && (
                      <p className="text-sm font-medium text-card-foreground">
                        {evento.leadNombre}
                      </p>
                    )}
                    {evento.propiedadCodigo && (
                      <p className="text-xs text-muted-foreground">
                        {evento.propiedadCodigo}
                      </p>
                    )}
                    {evento.ubicacion && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {evento.ubicacion}
                      </p>
                    )}
                    {evento.notas && (
                      <p className="mt-1 text-xs text-muted-foreground italic">
                        {evento.notas}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sincronizacion Google Calendar – Proximamente
              </p>
            </div>
          </div>
        </div>
      </div>

      {(showForm || editEvent) && (
        <EventoForm
          key={editEvent?.id ?? "new"}
          defaultDate={editEvent?.fecha ?? selectedDate}
          evento={editEvent ?? undefined}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
