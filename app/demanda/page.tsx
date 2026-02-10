"use client"

import { useCRM } from "@/lib/crm-context"
import { cn } from "@/lib/utils"

const estadoDemandaColors: Record<string, string> = {
  Activa: "bg-primary/10 text-primary",
  Pausada: "bg-secondary text-muted-foreground",
  Satisfecha: "bg-primary text-primary-foreground",
}

export default function DemandaActivaPage() {
  const { demandas } = useCRM()

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Preferencias de compra de clientes activos. El sistema detecta coincidencias automaticamente.
      </p>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tipo de propiedad</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Zona</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Presupuesto</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Condiciones</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {demandas.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-card-foreground">{d.clienteNombre}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.tipo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.zona}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.presupuesto}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.condiciones}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                        estadoDemandaColors[d.estado] || "bg-muted text-muted-foreground"
                      )}
                    >
                      {d.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
