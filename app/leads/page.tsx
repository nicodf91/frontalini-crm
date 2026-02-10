"use client"

import { useState } from "react"
import { useCRM } from "@/lib/crm-context"
import { LeadTable } from "@/components/leads/lead-table"
import { LeadForm } from "@/components/leads/lead-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function LeadsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Gestiona los leads del equipo comercial.
        </p>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Lead
        </Button>
      </div>

      {showForm && (
        <LeadForm onClose={() => setShowForm(false)} />
      )}

      <LeadTable />
    </div>
  )
}
