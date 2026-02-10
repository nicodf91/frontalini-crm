"use client"

import { useCRM } from "@/lib/crm-context"
import { cn } from "@/lib/utils"
import type { LeadEstado } from "@/lib/store"
import { GripVertical, ArrowRight } from "lucide-react"

const kanbanColumns: { estado: LeadEstado; label: string }[] = [
  { estado: "Nuevo", label: "Nuevo" },
  { estado: "Interesado", label: "Interesado" },
  { estado: "Visitó", label: "Visito" },
  { estado: "Negociación", label: "Negociacion" },
  { estado: "Cerrado", label: "Cerrado" },
]

const columnStyles: Record<LeadEstado, string> = {
  Nuevo: "border-t-primary/30",
  Interesado: "border-t-primary/50",
  "Visitó": "border-t-primary/60",
  "Negociación": "border-t-primary/80",
  Cerrado: "border-t-primary",
  Perdido: "border-t-secondary",
}

export default function ProcesoComercialPage() {
  const { leads, moveLeadEstado } = useCRM()

  // Filter out "Perdido" leads from the kanban
  const activaLeads = leads.filter((l) => l.estado !== "Perdido")

  function getNextEstado(current: LeadEstado): LeadEstado | null {
    const idx = kanbanColumns.findIndex((c) => c.estado === current)
    if (idx < 0 || idx >= kanbanColumns.length - 1) return null
    return kanbanColumns[idx + 1].estado
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Vista del pipeline comercial. Mueve leads entre etapas del proceso de venta.
      </p>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanColumns.map((col) => {
          const columnLeads = activaLeads.filter((l) => l.estado === col.estado)
          return (
            <div
              key={col.estado}
              className={cn(
                "flex w-64 shrink-0 flex-col rounded-xl border border-border border-t-4 bg-card shadow-sm",
                columnStyles[col.estado]
              )}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <h3 className="text-sm font-semibold text-card-foreground">
                  {col.label}
                </h3>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
                  {columnLeads.length}
                </span>
              </div>
              <div className="flex flex-col gap-2 px-3 pb-3">
                {columnLeads.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-4 text-center">
                    <p className="text-xs text-muted-foreground">Sin leads</p>
                  </div>
                )}
                {columnLeads.map((lead) => {
                  const nextEstado = getNextEstado(lead.estado)
                  return (
                    <div
                      key={lead.id}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <span className="text-sm font-medium text-card-foreground">
                          {lead.nombre}
                        </span>
                        <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${lead.tipoContacto === "Comprador" ? "border-primary/30 text-primary" : "border-secondary text-muted-foreground"}`}>
                          {lead.tipoContacto === "Comprador" ? "C" : "P"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(lead.tipoContacto === "Comprador" ? lead.tipoBuscado : lead.tipoOfrece) || ""}{lead.zona ? ` · ${lead.zona}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lead.proximoPaso || "—"}
                      </p>
                      {nextEstado && (
                        <button
                          type="button"
                          onClick={() => moveLeadEstado(lead.id, nextEstado)}
                          className="mt-1 flex items-center gap-1 self-start rounded-md bg-primary/5 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                        >
                          Mover a {nextEstado}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
