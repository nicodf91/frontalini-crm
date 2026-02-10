"use client"

import { usePathname } from "next/navigation"

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/leads": "Leads",
  "/propiedades": "Propiedades",
  "/demanda": "Demanda Activa",
  "/alertas": "Alertas",
  "/calendario": "Calendario",
  "/proceso": "Proceso Comercial",
}

export function AppHeader() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || "Frontalini"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-semibold text-card-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Administrador</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          A
        </div>
      </div>
    </header>
  )
}
