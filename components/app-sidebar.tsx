"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useCRM } from "@/lib/crm-context"
import {
  LayoutDashboard,
  Users,
  Building2,
  Search,
  Bell,
  Calendar,
  Kanban,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/leads", icon: Users },
  { label: "Propiedades", href: "/propiedades", icon: Building2 },
  { label: "Demanda Activa", href: "/demanda", icon: Search },
  { label: "Alertas", href: "/alertas", icon: Bell },
  { label: "Calendario", href: "/calendario", icon: Calendar },
  { label: "Proceso Comercial", href: "/proceso", icon: Kanban },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { alertas } = useCRM()
  const alertasPendientes = alertas.filter((a) => !a.resuelta).length

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-primary text-primary-foreground">
      <div className="flex h-16 items-center px-6">
        <span className="text-lg font-semibold tracking-tight">Frontalini</span>
      </div>
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            const isAlertas = item.href === "/alertas"
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-primary-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {isAlertas && alertasPendientes > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold leading-none text-white">
                      {alertasPendientes}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border px-4 py-4">
        <p className="text-xs text-primary-foreground/50">Sistema Comercial Inmobiliario</p>
      </div>
    </aside>
  )
}
