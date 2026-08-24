"use client"

import React, { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { useCRM } from "@/lib/crm-context"
import { Button } from "@/components/ui/button"
import { X, Upload, Trash2 } from "lucide-react"
import type { Propiedad, TipoPropiedad, EstadoPropiedad } from "@/lib/store"

const tiposPropiedad: TipoPropiedad[] = [
  "Casa",
  "Departamento",
  "Lote",
  "Casa Quinta",
  "Comercio",
  "Otro",
]
const estadosPropiedad: EstadoPropiedad[] = ["Disponible", "Reservada", "Vendida"]

export function PropiedadForm({
  onClose,
  propiedad,
}: {
  onClose: () => void
  propiedad?: Propiedad
}) {
  const { addPropiedad, updatePropiedad, retasarPropiedad, propiedades } = useCRM()
  const isEdit = Boolean(propiedad)

  const nextCode = React.useMemo(() => {
    const nums = propiedades
      .map((item) => {
        const match = item.codigo.match(/DEMO-(\d+)/)
        return match ? Number.parseInt(match[1], 10) : 0
      })
      .filter(Boolean)
    const max = nums.length > 0 ? Math.max(...nums) : 0
    return `DEMO-${String(max + 1).padStart(3, "0")}`
  }, [propiedades])

  const [codigo, setCodigo] = useState(propiedad?.codigo ?? nextCode)
  const [tipo, setTipo] = useState<TipoPropiedad>(propiedad?.tipo ?? "Departamento")
  const [direccion, setDireccion] = useState(propiedad?.direccion ?? "")
  const [zona, setZona] = useState(propiedad?.zona ?? "")
  const [precio, setPrecio] = useState(propiedad ? String(propiedad.precio) : "")
  const [ambientes, setAmbientes] = useState(propiedad?.ambientes?.toString() ?? "")
  const [superficie, setSuperficie] = useState(propiedad?.superficie?.toString() ?? "")
  const [estado, setEstado] = useState<EstadoPropiedad>(propiedad?.estado ?? "Disponible")
  const [descripcion, setDescripcion] = useState(propiedad?.descripcion ?? "")
  const [imagenes, setImagenes] = useState<string[]>(propiedad?.imagenes ?? [])
  const [imageError, setImageError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [retasarPrecio, setRetasarPrecio] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const originalPrecioRef = useRef<number | null>(propiedad?.precio ?? null)

  React.useEffect(() => {
    if (!propiedad) return
    originalPrecioRef.current = propiedad.precio
  }, [propiedad])

  const processFiles = useCallback((files: FileList | File[]) => {
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"])
    const availableSlots = Math.max(0, 5 - imagenes.length)
    const candidates = Array.from(files)
    const fileArray = candidates
      .filter((file) => allowedTypes.has(file.type) && file.size <= 5 * 1024 * 1024)
      .slice(0, availableSlots)

    setImageError(
      fileArray.length === candidates.length
        ? ""
        : "Podés adjuntar hasta 5 imágenes JPG, PNG o WebP de 5 MB cada una.",
    )
    if (fileArray.length === 0) return

    fileArray.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          setImagenes((prev) => [...prev, result])
        }
      }
      reader.readAsDataURL(file)
    })
  }, [imagenes.length])

  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  function removeImage(index: number) {
    setImagenes((prev) => prev.filter((_, i) => i !== index))
  }

  function handleRetasar() {
    if (!propiedad) return
    const precioNum = Number.parseFloat(retasarPrecio)
    if (Number.isNaN(precioNum) || precioNum <= 0) return
    const currentPrecio = originalPrecioRef.current ?? propiedad.precio
    if (precioNum === currentPrecio) return
    retasarPropiedad(propiedad.id, precioNum)
    setPrecio(String(precioNum))
    originalPrecioRef.current = precioNum
    setRetasarPrecio("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const precioNum = Number.parseFloat(precio)
    if (!codigo.trim() || Number.isNaN(precioNum) || precioNum <= 0) return

    if (isEdit && propiedad) {
      const originalPrecio = originalPrecioRef.current
      if (originalPrecio != null && precioNum !== originalPrecio) {
        retasarPropiedad(propiedad.id, precioNum)
        originalPrecioRef.current = precioNum
      }
      updatePropiedad(propiedad.id, {
        codigo: codigo.trim(),
        tipo,
        zona: zona.trim(),
        estado,
        direccion: direccion.trim() || undefined,
        descripcion: descripcion.trim() || undefined,
        ambientes: ambientes ? Number.parseInt(ambientes, 10) : undefined,
        superficie: superficie ? Number.parseFloat(superficie) : undefined,
        imagenes: imagenes.length > 0 ? imagenes : undefined,
      })
    } else {
      addPropiedad({
        codigo: codigo.trim(),
        tipo,
        zona: zona.trim(),
        precio: precioNum,
        estado,
        historialPrecios: [
          { precio: precioNum, fecha: new Date().toISOString().split("T")[0] },
        ],
        direccion: direccion.trim() || undefined,
        descripcion: descripcion.trim() || undefined,
        ambientes: ambientes ? Number.parseInt(ambientes, 10) : undefined,
        superficie: superficie ? Number.parseFloat(superficie) : undefined,
        imagenes: imagenes.length > 0 ? imagenes : undefined,
      })
    }
    onClose()
  }

  const inputClass =
    "rounded-lg border border-input bg-card px-3 py-2 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-card-foreground">
          {isEdit ? "Editar Propiedad" : "Nueva Propiedad"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
          aria-label="Cerrar formulario"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Section: Datos principales */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Datos principales
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Codigo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Codigo
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ej: DEMO-026"
                className={inputClass}
                required
              />
            </div>

            {/* Tipo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Tipo de propiedad
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoPropiedad)}
                className={inputClass}
              >
                {tiposPropiedad.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoPropiedad)}
                className={inputClass}
              >
                {estadosPropiedad.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            {/* Direccion */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Direccion
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Ej: Av. Libertador 1234"
                className={inputClass}
              />
            </div>

            {/* Zona */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Zona
              </label>
              <input
                type="text"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Ej: Centro, Zona Norte"
                className={inputClass}
                required
              />
            </div>

            {/* Precio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Precio (USD)
              </label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Ej: 85000"
                className={inputClass}
                min="0"
                required
              />
              {isEdit && (
                <p className="text-xs text-muted-foreground">
                  Si modificas el precio, se registrará una retasación al guardar.
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Section: Caracteristicas */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Caracteristicas
          </legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Ambientes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Ambientes
              </label>
              <input
                type="number"
                value={ambientes}
                onChange={(e) => setAmbientes(e.target.value)}
                placeholder="Ej: 3"
                className={inputClass}
                min="0"
              />
            </div>

            {/* Superficie */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-card-foreground">
                Superficie (m2)
              </label>
              <input
                type="number"
                value={superficie}
                onChange={(e) => setSuperficie(e.target.value)}
                placeholder="Ej: 120"
                className={inputClass}
                min="0"
              />
            </div>
          </div>

          {/* Descripcion */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-card-foreground">
              Descripcion
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describa las principales caracteristicas de la propiedad..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </fieldset>

        {/* Section: Imagenes */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Imagenes
          </legend>

          {/* Drop zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                fileInputRef.current?.click()
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Subir imagenes"
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-card-foreground">
                Arrastre imagenes aqui o haga click para seleccionar
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG o WebP. Puede agregar varias imagenes.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {imageError && <p className="text-xs text-destructive">{imageError}</p>}

          {/* Image preview grid */}
          {imagenes.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {imagenes.map((img, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Vista previa ${index + 1}`}
                    width={400}
                    height={300}
                    unoptimized
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-card/90 text-destructive opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    aria-label={`Eliminar imagen ${index + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground shadow-sm">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {imagenes.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {imagenes.length} {imagenes.length === 1 ? "imagen adjunta" : "imagenes adjuntas"}. La primera sera la imagen principal.
            </p>
          )}
        </fieldset>

        {isEdit && (
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Retasacion
            </legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-card-foreground">
                  Nuevo precio (USD)
                </label>
                <input
                  type="number"
                  value={retasarPrecio}
                  onChange={(e) => setRetasarPrecio(e.target.value)}
                  placeholder="Ej: 175000"
                  className={inputClass}
                  min="0"
                />
              </div>
              <div className="flex items-end">
                <Button type="button" onClick={handleRetasar}>
                  Registrar Retasacion
                </Button>
              </div>
            </div>
          </fieldset>
        )}

        {/* Actions */}
        <div className="flex gap-3 border-t border-border pt-5">
          <Button type="submit">{isEdit ? "Guardar cambios" : "Guardar Propiedad"}</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
