"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Camera, RotateCcw, Sun, Moon } from "lucide-react"
import type { ViewMode } from "@/types/tray-types"
import { useTheme } from "next-themes"

interface ViewControlsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void;
  onResetView: () => void;
}

export function ViewControls({ viewMode, onViewModeChange, onResetView }: ViewControlsProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
        <Button size="sm" variant="outline" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  );
}
