"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, GripVertical } from "lucide-react"
import type { TrayConfig } from "@/types/tray-types"
import { DesignManager } from "@/utils/design-manager"
import { useEffect } from "react"

interface EnhancedConfigPanelProps {
  config: TrayConfig
  onUpdateConfig: (updates: Partial<TrayConfig>) => void
  onAddDivider: (type: "horizontal" | "vertical", position: number) => void
  onRemoveDivider: (type: "horizontal" | "vertical", index: number) => void
}

export function EnhancedConfigPanel({
  config,
  onUpdateConfig,
  onAddDivider,
  onRemoveDivider,
}: EnhancedConfigPanelProps) {
  const designManager = DesignManager.getInstance()

  const updateDimension = (key: keyof typeof config.dimensions, value: number) => {
    const newDimensions = { ...config.dimensions, [key]: value }
    const thickness = designManager.calculateThickness(newDimensions.width)

    onUpdateConfig({
      dimensions: newDimensions,
      thickness,
    })
  }

  const updateBottomMaterial = (material: "flannel" | "eco-leather") => {
    onUpdateConfig({
      materials: { ...config.materials, bottom: material },
    })
  }

  // Auto-calculate thickness when width changes
  useEffect(() => {
    const thickness = designManager.calculateThickness(config.dimensions.width)
    if (thickness.base !== config.thickness.base) {
      onUpdateConfig({ thickness })
    }
  }, [config.dimensions.width])

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tray Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs">Width (mm)</Label>
            <Slider
              value={[config.dimensions.width]}
              onValueChange={([value]) => updateDimension("width", value)}
              min={100}
              max={2000}
              step={10}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">
              {config.dimensions.width}mm (Base thickness: {config.thickness.base}mm)
            </div>
          </div>

          <div>
            <Label className="text-xs">Depth (mm)</Label>
            <Slider
              value={[config.dimensions.depth]}
              onValueChange={([value]) => updateDimension("depth", value)}
              min={100}
              max={1200}
              step={10}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">{config.dimensions.depth}mm</div>
          </div>

          <div>
            <Label className="text-xs">Height (mm)</Label>
            <Slider
              value={[config.dimensions.height]}
              onValueChange={([value]) => updateDimension("height", value)}
              min={35}
              max={150}
              step={5}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">
              {config.dimensions.height}mm (min: 35mm, recommended: 40mm+)
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs">Top Cover</Label>
            <Switch
              checked={config.hasTopCover}
              onCheckedChange={(checked) => onUpdateConfig({ hasTopCover: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Bottom Material</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant={config.materials.bottom === "flannel" ? "default" : "outline"}
              onClick={() => updateBottomMaterial("flannel")}
            >
              Flannel
            </Button>
            <Button
              size="sm"
              variant={config.materials.bottom === "eco-leather" ? "default" : "outline"}
              onClick={() => updateBottomMaterial("eco-leather")}
            >
              Eco-Leather
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Dividers (Thickness: {config.thickness.dividers}mm)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Horizontal Dividers</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddDivider("horizontal", config.dimensions.depth / 2)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {config.dividers.horizontal.map((position, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical className="w-3 h-3 text-gray-400" />
                <Input
                  type="number"
                  value={position}
                  onChange={(e) => {
                    const newHorizontal = [...config.dividers.horizontal]
                    newHorizontal[index] = Number(e.target.value)
                    onUpdateConfig({
                      dividers: { ...config.dividers, horizontal: newHorizontal },
                    })
                  }}
                  className="text-xs"
                  min={10}
                  max={config.dimensions.depth - 10}
                />
                <Button size="sm" variant="outline" onClick={() => onRemoveDivider("horizontal", index)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Vertical Dividers</Label>
              <Button size="sm" variant="outline" onClick={() => onAddDivider("vertical", config.dimensions.width / 2)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {config.dividers.vertical.map((position, index) => (
              <div key={index} className="flex items-center gap-2">
                <GripVertical className="w-3 h-3 text-gray-400" />
                <Input
                  type="number"
                  value={position}
                  onChange={(e) => {
                    const newVertical = [...config.dividers.vertical]
                    newVertical[index] = Number(e.target.value)
                    onUpdateConfig({
                      dividers: { ...config.dividers, vertical: newVertical },
                    })
                  }}
                  className="text-xs"
                  min={10}
                  max={config.dimensions.width - 10}
                />
                <Button size="sm" variant="outline" onClick={() => onRemoveDivider("vertical", index)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
