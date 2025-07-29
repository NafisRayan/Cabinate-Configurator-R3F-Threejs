"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { Module } from "@/types/tray-types"

interface ModulePanelProps {
  selectedCell: { row: number; col: number } | null
  onAddModule: (module: Module) => void
  onRemoveModule: (moduleId: string) => void
  modules: Module[]
}

const moduleTypes = [
  {
    id: "ring-tray-grooved",
    name: "Ring Tray (Grooved)",
    description: "Parallel grooves for rings",
    category: "Rings",
  },
  {
    id: "ring-tray-slots",
    name: "Ring Tray (Slots)",
    description: "Individual ring slots",
    category: "Rings",
  },
  {
    id: "watch-pillow",
    name: "Watch Pillow",
    description: "Curved pillow for watches",
    category: "Watches",
  },
  {
    id: "watch-pad-flat",
    name: "Watch Pad (Flat)",
    description: "Flat pad for watches",
    category: "Watches",
  },
  {
    id: "glasses-insert",
    name: "Glasses Insert",
    description: "Holder for eyeglasses",
    category: "Accessories",
  },
  {
    id: "earring-flap",
    name: "Earring Flap",
    description: "Removable flap with holes",
    category: "Earrings",
  },
  {
    id: "necklace-hooks",
    name: "Necklace Hooks",
    description: "Hooks for necklaces",
    category: "Necklaces",
  },
  {
    id: "bracelet-bar",
    name: "Bracelet Bar",
    description: "Display bar for bracelets",
    category: "Bracelets",
  },
  {
    id: "deep-compartment",
    name: "Deep Compartment",
    description: "Extra deep storage",
    category: "Storage",
  },
  {
    id: "cover-flap",
    name: "Cover Flap",
    description: "Hinged protective cover",
    category: "Storage",
  },
  {
    id: "removable-tray",
    name: "Removable Tray",
    description: "Lift-out sub-tray",
    category: "Storage",
  },
  {
    id: "small-compartment",
    name: "Small Compartment",
    description: "Basic storage compartment",
    category: "Storage",
  },
]

// Group modules by category
const modulesByCategory = moduleTypes.reduce(
  (acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = []
    }
    acc[module.category].push(module)
    return acc
  },
  {} as Record<string, typeof moduleTypes>,
)

export function ModulePanel({ selectedCell, onAddModule, onRemoveModule, modules }: ModulePanelProps) {
  const addModule = (type: string) => {
    if (!selectedCell) return

    const module: Module = {
      id: Math.random().toString(36).substr(2, 9),
      type: type as Module["type"],
      cell: selectedCell,
      dimensions: { width: 50, depth: 50, height: 20 },
    }

    onAddModule(module)
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm">Modules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedCell ? (
          <div>
            <div className="text-xs text-gray-600 mb-2">
              Selected Cell: Row {selectedCell.row + 1}, Col {selectedCell.col + 1}
            </div>
            <div className="space-y-3">
              {Object.entries(modulesByCategory).map(([category, modules]) => (
                <div key={category}>
                  <div className="text-xs font-semibold text-gray-700 mb-1">{category}</div>
                  <div className="space-y-1">
                    {modules.map((moduleType) => (
                      <Button
                        key={moduleType.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addModule(moduleType.id)}
                        className="w-full text-left justify-start text-xs p-2 h-auto"
                      >
                        <div>
                          <div className="font-medium">{moduleType.name}</div>
                          <div className="text-gray-500 text-xs">{moduleType.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-500">Select a cell to add modules</div>
        )}

        {modules.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-2">Installed Modules</div>
            <div className="space-y-2">
              {modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="text-xs">
                    <div className="font-medium">{moduleTypes.find((t) => t.id === module.type)?.name}</div>
                    <div className="text-gray-500">
                      Row {module.cell.row + 1}, Col {module.cell.col + 1}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => onRemoveModule(module.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
