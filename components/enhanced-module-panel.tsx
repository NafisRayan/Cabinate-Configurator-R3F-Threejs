"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Copy } from "lucide-react"
import type { Module } from "@/types/tray-types"

interface EnhancedModulePanelProps {
  selectedCell: { row: number; col: number } | null
  onAddModule: (module: Module) => void
  onRemoveModule: (moduleId: string) => void
  onSelectModule: (moduleId: string | null) => void
  onDuplicateModule: (moduleId: string) => void
  modules: Module[]
  selectedModuleId: string | null
}

const moduleTypes = [
  {
    id: "ring-tray-grooved",
    name: "Ring Tray (Grooved)",
    description: "Parallel grooves for rings",
    category: "Rings",
    icon: "💍",
  },
  {
    id: "ring-tray-slots",
    name: "Ring Tray (Slots)",
    description: "Individual ring slots",
    category: "Rings",
    icon: "💍",
  },
  {
    id: "watch-pillow",
    name: "Watch Pillow",
    description: "Curved pillow for watches",
    category: "Watches",
    icon: "⌚",
  },
  {
    id: "watch-pad-flat",
    name: "Watch Pad (Flat)",
    description: "Flat pad for watches",
    category: "Watches",
    icon: "⌚",
  },
  {
    id: "glasses-insert",
    name: "Glasses Insert",
    description: "Holder for eyeglasses",
    category: "Accessories",
    icon: "👓",
  },
  {
    id: "earring-flap",
    name: "Earring Flap",
    description: "Removable flap with holes",
    category: "Earrings",
    icon: "👂",
  },
  {
    id: "necklace-hooks",
    name: "Necklace Hooks",
    description: "Hooks for necklaces",
    category: "Necklaces",
    icon: "📿",
  },
  {
    id: "bracelet-bar",
    name: "Bracelet Bar",
    description: "Display bar for bracelets",
    category: "Bracelets",
    icon: "🔗",
  },
  {
    id: "deep-compartment",
    name: "Deep Compartment",
    description: "Extra deep storage",
    category: "Storage",
    icon: "📦",
  },
  {
    id: "cover-flap",
    name: "Cover Flap",
    description: "Hinged protective cover",
    category: "Storage",
    icon: "🔒",
  },
  {
    id: "removable-tray",
    name: "Removable Tray",
    description: "Lift-out sub-tray",
    category: "Storage",
    icon: "📤",
  },
  {
    id: "small-compartment",
    name: "Small Compartment",
    description: "Basic storage compartment",
    category: "Storage",
    icon: "📦",
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

export function EnhancedModulePanel({
  selectedCell,
  onAddModule,
  onRemoveModule,
  onSelectModule,
  onDuplicateModule,
  modules,
  selectedModuleId,
}: EnhancedModulePanelProps) {
  const addModule = (type: string) => {
    if (!selectedCell) return

    const moduleType = moduleTypes.find((m) => m.id === type)
    const module: Module = {
      id: Math.random().toString(36).substr(2, 9),
      type: type as Module["type"],
      cell: selectedCell,
      dimensions: { width: 50, depth: 50, height: 20 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      isSelected: false,
      isHovered: false,
    }

    onAddModule(module)
  }

  const handleModuleClick = (moduleId: string) => {
    onSelectModule(selectedModuleId === moduleId ? null : moduleId)
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Modules</span>
          <Badge variant="secondary">{modules.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Modules */}
        {selectedCell ? (
          <div>
            <div className="text-xs text-gray-600 mb-3 p-2 bg-blue-50 rounded">
              <strong>Selected Cell:</strong> Row {selectedCell.row + 1}, Col {selectedCell.col + 1}
              <br />
              <span className="text-xs text-gray-500">Click categories below to add modules</span>
            </div>
            <div className="space-y-3">
              {Object.entries(modulesByCategory).map(([category, categoryModules]) => (
                <div key={category}>
                  <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span>{category}</span>
                    <Badge variant="outline" className="text-xs">
                      {categoryModules.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {categoryModules.map((moduleType) => (
                      <Button
                        key={moduleType.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addModule(moduleType.id)}
                        className="w-full text-left justify-start text-xs p-2 h-auto hover:bg-blue-50"
                      >
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-base">{moduleType.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{moduleType.name}</div>
                            <div className="text-gray-500 text-xs">{moduleType.description}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium">Select a Cell First</div>
            <div className="text-xs mt-1">Click on a grid cell in the 3D view to add modules</div>
          </div>
        )}

        {/* Existing Modules */}
        {modules.length > 0 && (
          <div>
            <div className="text-xs font-medium mb-2 flex items-center justify-between">
              <span>Installed Modules</span>
              <Badge variant="outline">{modules.length}</Badge>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {modules.map((module) => {
                const moduleType = moduleTypes.find((t) => t.id === module.type)
                const isSelected = selectedModuleId === module.id

                return (
                  <div
                    key={module.id}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : module.isHovered
                          ? "border-gray-400 bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm">{moduleType?.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs truncate">{moduleType?.name}</div>
                          <div className="text-gray-500 text-xs">
                            Row {module.cell.row + 1}, Col {module.cell.col + 1}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDuplicateModule(module.id)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRemoveModule(module.id)
                          }}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <div className="text-xs text-blue-600">
                          <div>
                            Position: {module.position.x.toFixed(1)}, {module.position.z.toFixed(1)}
                          </div>
                          <div>Scale: {module.scale.x.toFixed(2)}x</div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {modules.length === 0 && !selectedCell && (
          <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-sm">No modules added yet</div>
            <div className="text-xs mt-1">Select a cell to start adding modules</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
