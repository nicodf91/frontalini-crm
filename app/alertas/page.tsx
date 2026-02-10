"use client"

import { useMemo, useState } from "react"
import { useCRM } from "@/lib/crm-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle2 } from "lucide-react"

type TabType = "retasaciones" | "matches"

export default function AlertasPage() {
  const { alertas, resolverAlerta } = useCRM()
  const [activeTab, setActiveTab] = useState<TabType>("retasaciones")

  const retasaciones = useMemo(
    () => alertas.filter((a) => a.tipo === "retasacion"),
    [alertas]
  )
  const matches = useMemo(
    () => alertas.filter((a) => a.tipo === "match"),
    [alertas]
  )
  const pendingRetasaciones = retasaciones.filter((a) => !a.resuelta).length
  const pendingMatches = matches.filter((a) => !a.resuelta).length

  const filteredAlertas = useMemo(() => {
    const base = activeTab === "retasaciones" ? retasaciones : matches
    return base
      .slice()
      .sort((a, b) => {
        if (a.resuelta !== b.resuelta) return a.resuelta ? 1 : -1
        return b.fecha.localeCompare(a.fecha)
      })
  }, [activeTab, retasaciones, matches])

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Alertas generadas por retasaciones y coincidencias de demanda.
      </p>

      <div className="flex gap-1 rounded-lg bg-muted/50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("retasaciones")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "retasaciones"
              ? "bg-card text-card-foreground shadow-sm"
              : "text-muted-foreground hover:text-card-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            Retasaciones
            {pendingRetasaciones > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {pendingRetasaciones}
              </span>
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("matches")}
          className={cn(
            "rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === "matches"
              ? "bg-card text-card-foreground shadow-sm"
              : "text-muted-foreground hover:text-card-foreground"
          )}
        >
          <span className="flex items-center gap-2">
            Matches
            {pendingMatches > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {pendingMatches}
              </span>
            )}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {activeTab === "retasaciones" && pendingMatches > 0 && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Hay {pendingMatches} match{pendingMatches === 1 ? "" : "es"} pendiente{pendingMatches === 1 ? "" : "s"}.
            </p>
            <Button size="sm" variant="outline" onClick={() => setActiveTab("matches")}>
              Ver matches
            </Button>
          </div>
        )}
        {filteredAlertas.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">No hay alertas en esta categoria.</p>
          </div>
        )}
        {filteredAlertas.map((alerta) => (
          <div
            key={alerta.id}
            className={cn(
              "rounded-xl border border-border bg-card p-5 shadow-sm",
              alerta.resuelta && "opacity-60"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-card-foreground">
                    {alerta.leadNombre}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {alerta.propiedadCodigo}
                  </span>
                  {alerta.resuelta && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <CheckCircle2 className="h-3 w-3" />
                      Resuelta
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {alerta.mensaje}
                </p>
                <p className="text-xs text-muted-foreground">{alerta.fecha}</p>
              </div>
              {!alerta.resuelta && (
                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    onClick={() => resolverAlerta(alerta.id)}
                  >
                    Marcar resuelto
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
