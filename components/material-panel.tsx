"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { TrayConfig } from "@/types/tray-types"

interface MaterialPanelProps {
  config: TrayConfig
  onUpdateConfig: (updates: Partial<TrayConfig>) => void
}

const materials = [
  { id: "leather-tan", name: "Leather Tan", color: "#D2B48C" },
  { id: "leather-black", name: "Leather Black", color: "#2C2C2C" },
  { id: "velvet-black", name: "Velvet Black", color: "#1a1a1a" },
  { id: "velvet-navy", name: "Velvet Navy", color: "#1e3a8a" },
  { id: "suede-gray", name: "Suede Gray", color: "#6b7280" },
  { id: "fabric-cream", name: "Fabric Cream", color: "#f5f5dc" },
]

export function MaterialPanel({ config, onUpdateConfig }: MaterialPanelProps) {
  const updateMaterial = (component: "base" | "dividers" | "modules", materialId: string) => {
    const material = materials.find((m) => m.id === materialId)
    if (!material) return

    onUpdateConfig({
      materials: { ...config.materials, [component]: materialId },
      colors: { ...config.colors, [component]: material.color },
    })
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm">Materials & Colors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-xs font-medium mb-2">Base Material</div>
          <div className="grid grid-cols-2 gap-2">
            {materials.map((material) => (
              <Button
                key={material.id}
                variant={config.materials.base === material.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateMaterial("base", material.id)}
                className="text-xs p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border" style={{ backgroundColor: material.color }} />
                  <span className="truncate">{material.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium mb-2">Divider Material</div>
          <div className="grid grid-cols-2 gap-2">
            {materials.map((material) => (
              <Button
                key={material.id}
                variant={config.materials.dividers === material.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateMaterial("dividers", material.id)}
                className="text-xs p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border" style={{ backgroundColor: material.color }} />
                  <span className="truncate">{material.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium mb-2">Module Material</div>
          <div className="grid grid-cols-2 gap-2">
            {materials.map((material) => (
              <Button
                key={material.id}
                variant={config.materials.modules === material.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateMaterial("modules", material.id)}
                className="text-xs p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded border" style={{ backgroundColor: material.color }} />
                  <span className="truncate">{material.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
