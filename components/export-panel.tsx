"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileImage, FileText, Camera } from "lucide-react"
import type { TrayConfig } from "@/types/tray-types"

interface ExportPanelProps {
  config: TrayConfig
  designCode?: string
}

export function ExportPanel({ config, designCode }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportTopView = async () => {
    setIsExporting(true)
    try {
      // In production, this would capture the 3D scene from top view
      const canvas = document.querySelector("canvas")
      if (canvas) {
        const dataURL = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.download = `tray-${designCode || "design"}-top-view.png`
        link.href = dataURL
        link.click()
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportSideView = async () => {
    setIsExporting(true)
    try {
      // Similar to top view but from side angle
      const canvas = document.querySelector("canvas")
      if (canvas) {
        const dataURL = canvas.toDataURL("image/png")
        const link = document.createElement("a")
        link.download = `tray-${designCode || "design"}-side-view.png`
        link.href = dataURL
        link.click()
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const exportPDF = async () => {
    setIsExporting(true)
    try {
      // Generate PDF with design specifications
      const designData = {
        designCode: designCode || "N/A",
        dimensions: config.dimensions,
        materials: config.materials,
        dividers: config.dividers,
        modules: config.modules,
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(designData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `tray-${designCode || "design"}-specs.json`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("PDF export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm">Export & Rendering</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          onClick={exportTopView}
          disabled={isExporting}
          className="w-full bg-transparent"
          size="sm"
          variant="outline"
        >
          <Camera className="w-4 h-4 mr-2" />
          Export Top View
        </Button>

        <Button
          onClick={exportSideView}
          disabled={isExporting}
          className="w-full bg-transparent"
          size="sm"
          variant="outline"
        >
          <FileImage className="w-4 h-4 mr-2" />
          Export Side View
        </Button>

        <Button
          onClick={exportPDF}
          disabled={isExporting}
          className="w-full bg-transparent"
          size="sm"
          variant="outline"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export Specifications
        </Button>

        <div className="text-xs text-gray-500 mt-2">
          <p>• Top/side views: PNG format</p>
          <p>• Specifications: JSON format</p>
          <p>• All exports linked to design #{designCode || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  )
}
