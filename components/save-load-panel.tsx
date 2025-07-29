"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Save, Upload, Loader2 } from "lucide-react"

interface SaveLoadPanelProps {
  onSave: () => void
  onLoad: () => void
  isLoading: boolean
}

export function SaveLoadPanel({ onSave, onLoad, isLoading }: SaveLoadPanelProps) {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm">Save & Load</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={onSave} disabled={isLoading} className="w-full" size="sm">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Design
        </Button>

        <Button onClick={onLoad} disabled={isLoading} variant="outline" className="w-full bg-transparent" size="sm">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          Load Design
        </Button>
      </CardContent>
    </Card>
  )
}
