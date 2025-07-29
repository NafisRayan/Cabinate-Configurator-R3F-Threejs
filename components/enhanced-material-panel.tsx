"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TrayConfig, ColorOption } from "@/types/tray-types"

interface EnhancedMaterialPanelProps {
  config: TrayConfig
  onUpdateConfig: (updates: Partial<TrayConfig>) => void
}

const colorOptions: ColorOption[] = [
  { id: "leather-tan", name: "Tan", hex: "#D2B48C", material: "leather-tan" },
  { id: "leather-black", name: "Black", hex: "#2C2C2C", material: "leather-black" },
  { id: "leather-brown", name: "Brown", hex: "#8B4513", material: "leather-brown" },
  { id: "leather-burgundy", name: "Burgundy", hex: "#800020", material: "leather-burgundy" },
  { id: "velvet-black", name: "V. Black", hex: "#1a1a1a", material: "velvet-black" },
  { id: "velvet-navy", name: "V. Navy", hex: "#1e3a8a", material: "velvet-navy" },
  { id: "velvet-emerald", name: "V. Emerald", hex: "#065f46", material: "velvet-emerald" },
  { id: "velvet-burgundy", name: "V. Burgundy", hex: "#7c2d12", material: "velvet-burgundy" },
  { id: "suede-gray", name: "S. Gray", hex: "#6b7280", material: "suede-gray" },
  { id: "fabric-cream", name: "Cream", hex: "#f5f5dc", material: "fabric-cream" },
]

export function EnhancedMaterialPanel({ config, onUpdateConfig }: EnhancedMaterialPanelProps) {
  const updateMaterial = (component: "base" | "dividers" | "modules", colorOption: ColorOption) => {
    onUpdateConfig({
      materials: { ...config.materials, [component]: colorOption.material },
      colors: { ...config.colors, [component]: colorOption.hex },
    })
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm">Materials & Colors (10 Options)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-xs font-medium mb-2">Base Material</div>
          <div className="grid grid-cols-2 gap-1">
            {colorOptions.map((option) => (
              <Button
                key={`base-${option.id}`}
                variant={config.materials.base === option.material ? "default" : "outline"}
                size="sm"
                onClick={() => updateMaterial("base", option)}
                className="text-xs p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border" style={{ backgroundColor: option.hex }} />
                  <span className="truncate">{option.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium mb-2">Divider Material</div>
          <div className="grid grid-cols-2 gap-1">
            {colorOptions.map((option) => (
              <Button
                key={`dividers-${option.id}`}
                variant={config.materials.dividers === option.material ? "default" : "outline"}
                size="sm"
                onClick={() => updateMaterial("dividers", option)}
                className="text-xs p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border" style={{ backgroundColor: option.hex }} />
                  <span className="truncate">{option.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium mb-2">Module Material</div>
          <div className="grid grid-cols-2 gap-1">
            {colorOptions.map((option) => (
              <Button
                key={`modules-${option.id}`}
                variant={config.materials.modules === option.material ? "default" : "outline"}
                size="sm"
                onClick={() => updateMaterial("modules", option)}
                className="text-xs p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border" style={{ backgroundColor: option.hex }} />
                  <span className="truncate">{option.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
