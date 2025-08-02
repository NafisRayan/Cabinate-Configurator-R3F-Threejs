"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Copy, ChevronDown, ChevronRight, Plus, Move, Maximize, Settings, Target } from "lucide-react"
import type { Module } from "@/types/tray-types"

interface ModuleListWithSelectPlaceProps {
  onAddModule: () => void
  onRemoveModule: (moduleId: string) => void
  onSelectModule: (moduleId: string | null) => void
  onDuplicateModule: (moduleId: string) => void
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void
  modules: Module[]
  selectedModuleId: string | null
  moduleToPlace: string | null
  onSetModuleToPlace: (moduleId: string | null) => void
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

export function ModuleListWithSelectPlace({
  onAddModule,
  onRemoveModule,
  onSelectModule,
  onDuplicateModule,
  onUpdateModule,
  modules,
  selectedModuleId,
  moduleToPlace,
  onSetModuleToPlace,
}: ModuleListWithSelectPlaceProps) {
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

  const handlePlaceModule = (moduleId: string) => {
    if (moduleToPlace === moduleId) {
      onSetModuleToPlace(null) // Cancel placement
    } else {
      onSetModuleToPlace(moduleId) // Start placement
    }
  }

  const updateProperty = (moduleId: string, key: string, value: any) => {
    const module = modules.find((m) => m.id === moduleId)
    if (!module) return

    onUpdateModule(moduleId, {
      properties: { ...module.properties, [key]: value },
    })
  }

  const updateTransform = (
    moduleId: string,
    type: "position" | "rotation" | "scale",
    axis: "x" | "y" | "z",
    value: number,
  ) => {
    const module = modules.find((m) => m.id === moduleId)
    if (!module) return

    onUpdateModule(moduleId, {
      [type]: { ...module[type], [axis]: value },
    })
  }

  const updateDimension = (moduleId: string, axis: "width" | "depth" | "height", value: number) => {
    const module = modules.find((m) => m.id === moduleId)
    if (!module) return

    onUpdateModule(moduleId, {
      dimensions: { ...module.dimensions, [axis]: value },
    })
  }

  const resetTransform = (moduleId: string, type: "position" | "rotation" | "scale") => {
    const defaultValues = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    }
    onUpdateModule(moduleId, { [type]: defaultValues[type] })
  }

  // Separate placed and unplaced modules
  const placedModules = modules.filter((m) => m.cell.row !== -1 && m.cell.col !== -1)
  const unplacedModules = modules.filter((m) => m.cell.row === -1 && m.cell.col === -1)

  const renderModuleItem = (module: Module, isUnplaced = false) => {
    const moduleType = moduleTypes.find((t) => t.id === module.type)
    const isSelected = selectedModuleId === module.id
    const isExpanded = expandedModules.has(module.id)
    const isReadyToPlace = moduleToPlace === module.id

    return (
      <div
        key={module.id}
        className={`border rounded-lg transition-all ${
          isReadyToPlace
            ? "border-green-500 bg-green-50 shadow-md"
            : isSelected
              ? "border-blue-500 bg-blue-50"
              : module.isHovered
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200"
        }`}
      >
        {/* Module Header */}
        <div className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 cursor-pointer" onClick={() => handleModuleClick(module.id)}>
              <span className="text-sm">{moduleType?.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{moduleType?.name}</div>
                {isUnplaced ? (
                  <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-1">
                    📍 Not placed - Click "Place" then select a cell
                  </div>
                ) : (
                  <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mt-1">
                    📍 Row {module.cell.row + 1}, Col {module.cell.col + 1}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isUnplaced && (
                <Button
                  size="sm"
                  variant={isReadyToPlace ? "default" : "outline"}
                  onClick={() => handlePlaceModule(module.id)}
                  className={`h-6 text-xs px-2 ${isReadyToPlace ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <Target className="w-3 h-3 mr-1" />
                  {isReadyToPlace ? "Cancel" : "Place"}
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => toggleExpanded(module.id)} className="h-6 w-6 p-0">
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
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
        </div>

        {/* Expanded Properties */}
        {isExpanded && (
          <div className="border-t bg-white p-3">
            <Tabs defaultValue="transform" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transform" className="text-xs">
                  <Move className="w-3 h-3 mr-1" />
                  Transform
                </TabsTrigger>
                <TabsTrigger value="dimensions" className="text-xs">
                  <Maximize className="w-3 h-3 mr-1" />
                  Size
                </TabsTrigger>
                <TabsTrigger value="properties" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Props
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transform" className="space-y-3 mt-3">
                {/* Position */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-medium">Position</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetTransform(module.id, "position")}
                      className="h-5 text-xs px-2"
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {["x", "z"].map((axis) => (
                      <div key={axis} className="flex items-center gap-2">
                        <Label className="text-xs w-4 uppercase">{axis}:</Label>
                        <Slider
                          value={[module.position[axis as "x" | "z"]]}
                          onValueChange={([value]) => updateTransform(module.id, "position", axis as "x" | "z", value)}
                          min={-100}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={module.position[axis as "x" | "z"].toFixed(1)}
                          onChange={(e) =>
                            updateTransform(module.id, "position", axis as "x" | "z", Number(e.target.value))
                          }
                          className="w-12 h-5 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scale */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-medium">Scale</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetTransform(module.id, "scale")}
                      className="h-5 text-xs px-2"
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-4">All:</Label>
                    <Slider
                      value={[module.scale.x]}
                      onValueChange={([value]) => {
                        onUpdateModule(module.id, {
                          scale: { x: value, y: value, z: value },
                        })
                      }}
                      min={0.1}
                      max={3}
                      step={0.1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={module.scale.x.toFixed(2)}
                      onChange={(e) => {
                        const value = Number(e.target.value)
                        onUpdateModule(module.id, {
                          scale: { x: value, y: value, z: value },
                        })
                      }}
                      className="w-12 h-5 text-xs"
                      step={0.1}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dimensions" className="space-y-3 mt-3">
                {[
                  { key: "width", label: "Width" },
                  { key: "depth", label: "Depth" },
                  { key: "height", label: "Height" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Label className="text-xs w-10">{label}:</Label>
                    <Slider
                      value={[module.dimensions[key as keyof typeof module.dimensions]]}
                      onValueChange={([value]) =>
                        updateDimension(module.id, key as "width" | "depth" | "height", value)
                      }
                      min={10}
                      max={200}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={module.dimensions[key as keyof typeof module.dimensions]}
                      onChange={(e) =>
                        updateDimension(module.id, key as "width" | "depth" | "height", Number(e.target.value))
                      }
                      className="w-12 h-5 text-xs"
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="properties" className="space-y-3 mt-3">
                {/* Module-specific properties */}
                {(module.type === "ring-tray-grooved" || module.type === "ring-tray-slots") && (
                  <div>
                    <Label className="text-xs">Slots/Grooves</Label>
                    <Slider
                      value={[module.properties?.slots || 5]}
                      onValueChange={([value]) => updateProperty(module.id, "slots", value)}
                      min={3}
                      max={12}
                      step={1}
                      className="mt-1"
                    />
                    <div className="text-xs text-gray-500 mt-1">{module.properties?.slots || 5} slots</div>
                  </div>
                )}

                {["necklace-hooks", "bracelet-bar", "ring-tray-grooved"].includes(module.type) && (
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Horizontal</Label>
                    <Switch
                      checked={module.properties?.orientation === "horizontal"}
                      onCheckedChange={(checked) =>
                        updateProperty(module.id, "orientation", checked ? "horizontal" : "vertical")
                      }
                    />
                  </div>
                )}

                {["earring-flap", "removable-tray"].includes(module.type) && (
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Removable</Label>
                    <Switch
                      checked={module.properties?.isRemovable || false}
                      onCheckedChange={(checked) => updateProperty(module.id, "isRemovable", checked)}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    )
  }

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
                    💡 Click "Place" on a module, then click a cell in the 3D view to place it
                  </div>
                  {unplacedModules.map((module) => renderModuleItem(module, true))}
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
                  {placedModules.map((module) => renderModuleItem(module, false))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
