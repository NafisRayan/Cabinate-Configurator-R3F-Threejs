"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Camera } from "lucide-react"
import type { ViewMode } from "@/types/tray-types"

interface ViewControlsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function ViewControls({ viewMode, onViewModeChange }: ViewControlsProps) {
  return (
    <Card className="absolute top-4 right-4 z-10 p-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={viewMode === "perspective" ? "default" : "outline"}
          onClick={() => onViewModeChange("perspective")}
        >
          <Eye className="w-4 h-4 mr-1" />
          3D View
        </Button>
        <Button size="sm" variant={viewMode === "top" ? "default" : "outline"} onClick={() => onViewModeChange("top")}>
          <Camera className="w-4 h-4 mr-1" />
          Top View
        </Button>
      </div>
    </Card>
  )
}
