import React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { CRMProvider } from "@/lib/crm-context"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Frontalini – Sistema Comercial Inmobiliario",
  description: "CRM para gestión comercial de venta de propiedades",
}

export const viewport: Viewport = {
  themeColor: "#152B47",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <CRMProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex flex-1 flex-col pl-60">
              <AppHeader />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#152B47",
                color: "#F2F4F7",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                fontSize: "13px",
              },
            }}
            duration={5000}
          />
        </CRMProvider>
      </body>
    </html>
  )
}
