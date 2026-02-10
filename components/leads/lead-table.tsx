"use client"

import { useCRM } from "@/lib/crm-context"
import { cn } from "@/lib/utils"
import type { LeadEstado } from "@/lib/store"

const estadoColors: Record<LeadEstado, string> = {
  Nuevo: "bg-primary/10 text-primary",
  Interesado: "bg-primary/20 text-primary",
  Visitó: "bg-primary/30 text-primary",
  Negociación: "bg-primary/40 text-primary-foreground",
  Cerrado: "bg-primary text-primary-foreground",
  Perdido: "bg-secondary text-muted-foreground",
}

export function LeadTable() {
  const { leads } = useCRM()

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Nombre
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Tipo
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Canal
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Tipo propiedad
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Zona
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Presupuesto
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Estado
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Proximo paso
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const isComprador = lead.tipoContacto === "Comprador"
              const tipoPropiedad = isComprador
                ? lead.tipoBuscado
                : lead.tipoOfrece
              return (
                <tr
                  key={lead.id}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {lead.nombre}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        isComprador
                          ? "border-primary/30 text-primary"
                          : "border-secondary text-muted-foreground"
                      )}
                    >
                      {lead.tipoContacto}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lead.canal}
                  </td>
                  <td className="px-4 py-3 text-card-foreground">
                    {tipoPropiedad || "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lead.zona || "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {isComprador ? (lead.presupuesto || "\u2014") : "\u2014"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        estadoColors[lead.estado]
                      )}
                    >
                      {lead.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {lead.proximoPaso || "\u2014"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
