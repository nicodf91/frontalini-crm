"use client"

import { useState } from "react"
import Image from "next/image"
import { useCRM } from "@/lib/crm-context"
import { Button } from "@/components/ui/button"
import { Building2, RefreshCw, Plus, MapPin, Maximize2, Grid3X3, Pencil } from "lucide-react"
import { PropiedadForm } from "@/components/propiedades/propiedad-form"
import type { EstadoPropiedad, Propiedad } from "@/lib/store"

const estadoLabel: Record<EstadoPropiedad, string> = {
  Disponible: "bg-primary/10 text-primary",
  Reservada: "bg-primary/30 text-primary",
  Vendida: "bg-primary text-primary-foreground",
}

export default function PropiedadesPage() {
  const { propiedades, retasarPropiedad } = useCRM()
  const [showForm, setShowForm] = useState(false)
  const [editPropiedadId, setEditPropiedadId] = useState<string | null>(null)
  const [retasarId, setRetasarId] = useState<string | null>(null)
  const [nuevoPrecio, setNuevoPrecio] = useState("")

  function handleRetasar(id: string) {
    const precio = Number.parseFloat(nuevoPrecio)
    if (Number.isNaN(precio) || precio <= 0) return
    retasarPropiedad(id, precio)
    setRetasarId(null)
    setNuevoPrecio("")
  }

  function handleEdit(prop: Propiedad) {
    setShowForm(false)
    setRetasarId(null)
    setNuevoPrecio("")
    setEditPropiedadId(prop.id)
  }

  function handleCloseForm() {
    setShowForm(false)
    setEditPropiedadId(null)
  }

  const editPropiedad = editPropiedadId
    ? propiedades.find((p) => p.id === editPropiedadId) ?? null
    : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Cartera de propiedades en venta.
        </p>
        <Button
          onClick={() => setShowForm(true)}
          className="gap-2"
          disabled={showForm || !!editPropiedadId}
        >
          <Plus className="h-4 w-4" />
          Nueva Propiedad
        </Button>
      </div>

      {(showForm || editPropiedad) && (
        <PropiedadForm
          key={editPropiedad?.id ?? "new"}
          onClose={handleCloseForm}
          propiedad={editPropiedad ?? undefined}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {propiedades.map((prop) => (
          <div
            key={prop.id}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            {/* Image section */}
            {prop.imagenes && prop.imagenes.length > 0 ? (
              <div className="relative">
                <Image
                  src={prop.imagenes[0] || "/placeholder.svg"}
                  alt={`Propiedad ${prop.codigo}`}
                  width={800}
                  height={500}
                  unoptimized
                  className="aspect-[16/10] w-full object-cover"
                />
                {prop.imagenes.length > 1 && (
                  <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-card/90 px-2 py-1 text-xs font-medium text-card-foreground shadow-sm">
                    +{prop.imagenes.length - 1} fotos
                  </span>
                )}
                <span
                  className={`absolute left-2 top-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ${estadoLabel[prop.estado]}`}
                >
                  {prop.estado}
                </span>
              </div>
            ) : (
              <div className="relative flex aspect-[16/10] items-center justify-center bg-muted/50">
                <Building2 className="h-8 w-8 text-muted-foreground/40" />
                <span
                  className={`absolute left-2 top-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${estadoLabel[prop.estado]}`}
                >
                  {prop.estado}
                </span>
              </div>
            )}

            {/* Content section */}
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-card-foreground">
                  {prop.codigo}
                </span>
                <span className="text-base font-bold text-card-foreground">
                  USD {prop.precio.toLocaleString()}
                </span>
              </div>

              {prop.descripcion && (
                <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                  {prop.descripcion}
                </p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {prop.tipo}
                </span>
                {prop.zona && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {prop.zona}
                  </span>
                )}
                {prop.ambientes != null && (
                  <span className="flex items-center gap-1">
                    <Grid3X3 className="h-3 w-3" />
                    {prop.ambientes} amb.
                  </span>
                )}
                {prop.superficie != null && (
                  <span className="flex items-center gap-1">
                    <Maximize2 className="h-3 w-3" />
                    {prop.superficie} m2
                  </span>
                )}
              </div>

              {prop.direccion && (
                <p className="text-xs text-muted-foreground">
                  {prop.direccion}
                </p>
              )}

              {/* Retasacion */}
              {retasarId === prop.id ? (
                <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3">
                  <label className="text-xs font-medium text-card-foreground">
                    Nuevo precio (USD)
                  </label>
                  <input
                    type="number"
                    value={nuevoPrecio}
                    onChange={(e) => setNuevoPrecio(e.target.value)}
                    placeholder="Ej: 175000"
                    className="rounded-lg border border-input bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleRetasar(prop.id)}>
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRetasarId(null)
                        setNuevoPrecio("")
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => handleEdit(prop)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => setRetasarId(prop.id)}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Registrar Retasacion
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
