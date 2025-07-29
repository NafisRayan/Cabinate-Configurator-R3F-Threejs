"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import type { TrayConfig } from "@/types/tray-types"

interface ConfigPanelProps {
  config: TrayConfig
  onUpdateConfig: (updates: Partial<TrayConfig>) => void
  onAddDivider: (type: "horizontal" | "vertical", position: number) => void
  onRemoveDivider: (type: "horizontal" | "vertical", index: number) => void
}

export function ConfigPanel({ config, onUpdateConfig, onAddDivider, onRemoveDivider }: ConfigPanelProps) {
  const updateDimension = (key: keyof typeof config.dimensions, value: number) => {
    onUpdateConfig({
      dimensions: { ...config.dimensions, [key]: value },
    })
  }

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
              max={800}
              step={10}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">{config.dimensions.width}mm</div>
          </div>

          <div>
            <Label className="text-xs">Depth (mm)</Label>
            <Slider
              value={[config.dimensions.depth]}
              onValueChange={([value]) => updateDimension("depth", value)}
              min={100}
              max={600}
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
              min={20}
              max={100}
              step={5}
              className="mt-2"
            />
            <div className="text-xs text-gray-500 mt-1">{config.dimensions.height}mm</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Dividers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Horizontal</Label>
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
                />
                <Button size="sm" variant="outline" onClick={() => onRemoveDivider("horizontal", index)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs">Vertical</Label>
              <Button size="sm" variant="outline" onClick={() => onAddDivider("vertical", config.dimensions.width / 2)}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            {config.dividers.vertical.map((position, index) => (
              <div key={index} className="flex items-center gap-2">
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
