"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { Module } from "@/types/tray-types"
import { DraggableModuleItem } from "./draggable-module-item"

interface ModuleListWithDragDropProps {
  onAddModule: () => void
  onRemoveModule: (moduleId: string) => void
  onSelectModule: (moduleId: string | null) => void
  onDuplicateModule: (moduleId: string) => void
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void
  modules: Module[]
  selectedModuleId: string | null
  draggedModuleId: string | null
  onDragStart: (moduleId: string) => void
  onDragEnd: () => void
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

export function ModuleListWithDragDrop({
  onAddModule,
  onRemoveModule,
  onSelectModule,
  onDuplicateModule,
  onUpdateModule,
  modules,
  selectedModuleId,
  draggedModuleId,
  onDragStart,
  onDragEnd,
}: ModuleListWithDragDropProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const toggleExpanded = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleModuleClick = (moduleId: string) => {
    onSelectModule(selectedModuleId === moduleId ? null : moduleId)
  }

  // Separate placed and unplaced modules
  const placedModules = modules.filter((m) => m.cell.row !== -1 && m.cell.col !== -1)
  const unplacedModules = modules.filter((m) => m.cell.row === -1 && m.cell.col === -1)

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Modules</span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{modules.length}</Badge>
            <Button size="sm" variant="outline" onClick={onAddModule}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.length === 0 ? (
          <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">📦</div>
            <div className="text-sm">No modules added yet</div>
            <div className="text-xs mt-1">Click the + button to add modules</div>
          </div>
        ) : (
          <>
            {/* Unplaced Modules */}
            {unplacedModules.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-2">
                  <span>Unplaced Modules</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-600">
                    {unplacedModules.length}
                  </Badge>
                </div>
                <div className="space-y-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-xs text-orange-700 mb-2">
                    💡 Drag these modules to cells in the 3D view to place them
                  </div>
                  {unplacedModules.map((module) => {
                    const moduleType = moduleTypes.find((t) => t.id === module.type)
                    return (
                      <DraggableModuleItem
                        key={module.id}
                        module={module}
                        moduleType={moduleType}
                        isSelected={selectedModuleId === module.id}
                        isExpanded={expandedModules.has(module.id)}
                        onSelect={() => handleModuleClick(module.id)}
                        onToggleExpanded={() => toggleExpanded(module.id)}
                        onRemove={() => onRemoveModule(module.id)}
                        onDuplicate={() => onDuplicateModule(module.id)}
                        onUpdate={(updates) => onUpdateModule(module.id, updates)}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* Placed Modules */}
            {placedModules.length > 0 && (
              <div>
                <div className="text-xs font-medium mb-2 flex items-center gap-2">
                  <span>Placed Modules</span>
                  <Badge variant="outline" className="bg-green-50 text-green-600">
                    {placedModules.length}
                  </Badge>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {placedModules.map((module) => {
                    const moduleType = moduleTypes.find((t) => t.id === module.type)
                    return (
                      <DraggableModuleItem
                        key={module.id}
                        module={module}
                        moduleType={moduleType}
                        isSelected={selectedModuleId === module.id}
                        isExpanded={expandedModules.has(module.id)}
                        onSelect={() => handleModuleClick(module.id)}
                        onToggleExpanded={() => toggleExpanded(module.id)}
                        onRemove={() => onRemoveModule(module.id)}
                        onDuplicate={() => onDuplicateModule(module.id)}
                        onUpdate={(updates) => onUpdateModule(module.id, updates)}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
