export type Canal = "WhatsApp" | "Mercado Libre" | "Instagram" | "Facebook"
export type LeadEstado = "Nuevo" | "Interesado" | "Visitó" | "Negociación" | "Cerrado" | "Perdido"
export type Presupuesto =
  | "Hasta USD 50.000"
  | "USD 50.000 – 100.000"
  | "USD 100.000 – 200.000"
  | "Más de USD 200.000"
  | "A definir"
export type TipoPropiedad = "Casa" | "Departamento" | "Lote" | "Casa Quinta" | "Comercio" | "Otro"
export type EstadoPropiedad = "Disponible" | "Reservada" | "Vendida"
export type TipoEvento = "Llamada" | "Visita" | "Seguimiento" | "Reunión" | "Tasación"
export type TipoContacto = "Comprador" | "Propietario"
export type MotivoContacto = "Venta" | "Tasación" | "Consulta general"

export interface Lead {
  id: string
  tipoContacto: TipoContacto
  nombre: string
  telefono: string
  canal: Canal
  zona: string
  estado: LeadEstado
  proximoPaso: string
  // Comprador fields
  tipoBuscado?: TipoPropiedad
  presupuesto?: Presupuesto
  // Propietario fields
  tipoOfrece?: TipoPropiedad
  motivoContacto?: MotivoContacto
}

export interface Propiedad {
  id: string
  codigo: string
  tipo: TipoPropiedad
  zona: string
  precio: number
  estado: EstadoPropiedad
  historialPrecios: { precio: number; fecha: string }[]
  direccion?: string
  descripcion?: string
  ambientes?: number
  superficie?: number
  imagenes?: string[]
}

export interface DemandaActiva {
  id: string
  clienteId: string
  clienteNombre: string
  tipo: TipoPropiedad
  zona: string
  presupuesto: Presupuesto
  condiciones: string
  estado: "Activa" | "Pausada" | "Satisfecha"
}

export interface Alerta {
  id: string
  tipo: "retasacion" | "match"
  leadId: string
  leadNombre: string
  propiedadId: string
  propiedadCodigo: string
  mensaje: string
  resuelta: boolean
  fecha: string
}

export interface Evento {
  id: string
  titulo: string
  tipo: TipoEvento
  fecha: string
  hora: string
  duracion?: string
  leadId?: string
  leadNombre?: string
  propiedadId?: string
  propiedadCodigo?: string
  ubicacion?: string
  recordatorio?: boolean
  notas: string
}

export const initialLeads: Lead[] = [
  {
    id: "l1",
    tipoContacto: "Comprador",
    nombre: "María González",
    telefono: "+54 11 5555 1234",
    canal: "WhatsApp",
    tipoBuscado: "Departamento",
    zona: "Centro",
    presupuesto: "USD 50.000 – 100.000",
    estado: "Interesado",
    proximoPaso: "Llamar viernes",
  },
  {
    id: "l2",
    tipoContacto: "Comprador",
    nombre: "Carlos Rodríguez",
    telefono: "+54 11 5555 5678",
    canal: "Mercado Libre",
    tipoBuscado: "Casa",
    zona: "Zona Norte",
    presupuesto: "USD 100.000 – 200.000",
    estado: "Visitó",
    proximoPaso: "Enviar propuesta lunes",
  },
  {
    id: "l3",
    tipoContacto: "Comprador",
    nombre: "Ana Martínez",
    telefono: "+54 11 5555 9012",
    canal: "Instagram",
    tipoBuscado: "Lote",
    zona: "Barrio cerrado",
    presupuesto: "Hasta USD 50.000",
    estado: "Nuevo",
    proximoPaso: "Contactar por WhatsApp",
  },
  {
    id: "l4",
    tipoContacto: "Propietario",
    nombre: "Roberto Fernández",
    telefono: "+54 11 5555 3456",
    canal: "Facebook",
    tipoOfrece: "Casa Quinta",
    zona: "Zona Sur",
    motivoContacto: "Venta",
    estado: "Negociación",
    proximoPaso: "Reunión martes 14:00",
  },
  {
    id: "l5",
    tipoContacto: "Propietario",
    nombre: "Lucía Romero",
    telefono: "+54 11 5555 7890",
    canal: "WhatsApp",
    tipoOfrece: "Departamento",
    zona: "Centro",
    motivoContacto: "Tasación",
    estado: "Nuevo",
    proximoPaso: "Coordinar visita para tasación",
  },
]

export const initialPropiedades: Propiedad[] = [
  {
    id: "p1",
    codigo: "FRO-018",
    tipo: "Departamento",
    zona: "Centro",
    precio: 85000,
    estado: "Disponible",
    historialPrecios: [
      { precio: 95000, fecha: "2025-06-01" },
      { precio: 85000, fecha: "2025-12-15" },
    ],
  },
  {
    id: "p2",
    codigo: "FRO-021",
    tipo: "Casa",
    zona: "Zona Norte",
    precio: 175000,
    estado: "Disponible",
    historialPrecios: [{ precio: 175000, fecha: "2025-10-01" }],
  },
  {
    id: "p3",
    codigo: "FRO-025",
    tipo: "Lote",
    zona: "Barrio cerrado",
    precio: 42000,
    estado: "Reservada",
    historialPrecios: [{ precio: 42000, fecha: "2025-11-10" }],
  },
]

export const initialDemandas: DemandaActiva[] = [
  {
    id: "d1",
    clienteId: "l1",
    clienteNombre: "María González",
    tipo: "Departamento",
    zona: "Centro",
    presupuesto: "USD 50.000 – 100.000",
    condiciones: "2 ambientes mínimo, luminoso",
    estado: "Activa",
  },
  {
    id: "d2",
    clienteId: "l2",
    clienteNombre: "Carlos Rodríguez",
    tipo: "Casa",
    zona: "Zona Norte",
    presupuesto: "USD 100.000 – 200.000",
    condiciones: "3 dormitorios, garage",
    estado: "Activa",
  },
]

export const initialAlertas: Alerta[] = [
  {
    id: "a1",
    tipo: "retasacion",
    leadId: "l1",
    leadNombre: "María González",
    propiedadId: "p1",
    propiedadCodigo: "FRO-018",
    mensaje: "La propiedad FRO-018 fue retasada de USD 95.000 a USD 85.000. Podría interesarle a María González.",
    resuelta: false,
    fecha: "2025-12-15",
  },
  {
    id: "a2",
    tipo: "match",
    leadId: "l1",
    leadNombre: "María González",
    propiedadId: "p1",
    propiedadCodigo: "FRO-018",
    mensaje: "La propiedad FRO-018 (Departamento en Centro, USD 85.000) coincide con la búsqueda de María González.",
    resuelta: false,
    fecha: "2025-12-10",
  },
]

export const initialEventos: Evento[] = [
  {
    id: "e1",
    titulo: "Llamar a María González",
    tipo: "Llamada",
    fecha: new Date().toISOString().split("T")[0],
    hora: "10:00",
    duracion: "30 min",
    leadId: "l1",
    leadNombre: "María González",
    notas: "Consultar disponibilidad para visita",
  },
  {
    id: "e2",
    titulo: "Visita FRO-021 con Carlos",
    tipo: "Visita",
    fecha: new Date().toISOString().split("T")[0],
    hora: "16:00",
    duracion: "1 hora",
    leadId: "l2",
    leadNombre: "Carlos Rodríguez",
    notas: "Segunda visita al inmueble",
  },
]

// Utility to check if a property price is compatible with a lead's budget
export function presupuestoCompatible(presupuesto: Presupuesto, precio: number): boolean {
  switch (presupuesto) {
    case "Hasta USD 50.000":
      return precio <= 50000
    case "USD 50.000 – 100.000":
      return precio >= 50000 && precio <= 100000
    case "USD 100.000 – 200.000":
      return precio >= 100000 && precio <= 200000
    case "Más de USD 200.000":
      return precio > 200000
    case "A definir":
      return true
    default:
      return false
  }
}

// Utility to check if two zone strings are compatible (basic text match)
export function zonaCompatible(zonaLead: string, zonaProp: string): boolean {
  if (!zonaLead || !zonaProp) return false
  const a = zonaLead.toLowerCase().trim()
  const b = zonaProp.toLowerCase().trim()
  return a === b || a.includes(b) || b.includes(a)
}
