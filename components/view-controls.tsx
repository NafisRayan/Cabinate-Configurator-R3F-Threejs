"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Camera, RotateCcw } from "lucide-react"
import type { ViewMode } from "@/types/tray-types"

interface ViewControlsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void;
  onResetView: () => void;
}

export function ViewControls({ viewMode, onViewModeChange, onResetView }: ViewControlsProps) {
  return (
    <Card className="absolute top-4 left-1/2 -translate-x-1/2 z-10 p-2">
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
        <Button size="sm" variant="outline" onClick={onResetView}>
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset View
        </Button>
      </div>
    </Card>
  );
}
