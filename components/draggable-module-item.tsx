"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Copy, ChevronDown, ChevronRight, Move, Maximize, Settings, GripVertical } from "lucide-react"
import type { Module } from "@/types/tray-types"

interface DraggableModuleItemProps {
  module: Module
  moduleType: any
  isSelected: boolean
  isExpanded: boolean
  onSelect: () => void
  onToggleExpanded: () => void
  onRemove: () => void
  onDuplicate: () => void
  onUpdate: (updates: Partial<Module>) => void
  onDragStart: (moduleId: string) => void
  onDragEnd: () => void
}

export function DraggableModuleItem({
  module,
  moduleType,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpanded,
  onRemove,
  onDuplicate,
  onUpdate,
  onDragStart,
  onDragEnd,
}: DraggableModuleItemProps) {
  const [isDragging, setIsDragging] = useState(false)

  const updateProperty = (key: string, value: any) => {
    onUpdate({
      properties: { ...module.properties, [key]: value },
    })
  }

  const updateTransform = (type: "position" | "rotation" | "scale", axis: "x" | "y" | "z", value: number) => {
    onUpdate({
      [type]: { ...module[type], [axis]: value },
    })
  }

  const updateDimension = (axis: "width" | "depth" | "height", value: number) => {
    onUpdate({
      dimensions: { ...module.dimensions, [axis]: value },
    })
  }

  const resetTransform = (type: "position" | "rotation" | "scale") => {
    const defaultValues = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    }
    onUpdate({ [type]: defaultValues[type] })
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    onDragStart(module.id)

    // Store the dragged module ID in sessionStorage for the 3D scene to access
    sessionStorage.setItem("draggedModuleId", module.id)

    e.dataTransfer.setData("text/plain", module.id)
    e.dataTransfer.effectAllowed = "move"

    // Create a custom drag image
    const dragImage = document.createElement("div")
    dragImage.innerHTML = `${moduleType?.icon} ${moduleType?.name}`
    dragImage.style.padding = "8px 12px"
    dragImage.style.backgroundColor = "#3b82f6"
    dragImage.style.color = "white"
    dragImage.style.borderRadius = "6px"
    dragImage.style.fontSize = "14px"
    dragImage.style.position = "absolute"
    dragImage.style.top = "-1000px"
    document.body.appendChild(dragImage)

    e.dataTransfer.setDragImage(dragImage, 0, 0)

    setTimeout(() => document.body.removeChild(dragImage), 0)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false)
    onDragEnd()

    // Clean up
    sessionStorage.removeItem("draggedModuleId")
  }

  const getCellDisplay = () => {
    if (module.cell.row === -1 && module.cell.col === -1) {
      return <div className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">📍 Not placed - Drag to cell</div>
    }
    return (
      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
        📍 Row {module.cell.row + 1}, Col {module.cell.col + 1}
      </div>
    )
  }

  return (
    <div
      className={`border rounded-lg transition-all cursor-move ${
        isDragging
          ? "border-blue-500 bg-blue-100 opacity-50 transform rotate-2"
          : isSelected
            ? "border-blue-500 bg-blue-50"
            : module.isHovered
              ? "border-gray-400 bg-gray-50"
              : "border-gray-200 hover:border-gray-300"
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Module Header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1" onClick={onSelect}>
            <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
            <span className="text-sm">{moduleType?.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{moduleType?.name}</div>
              {getCellDisplay()}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={onToggleExpanded} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
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
                onRemove()
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
                    onClick={() => resetTransform("position")}
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
                        onValueChange={([value]) => updateTransform("position", axis as "x" | "z", value)}
                        min={-100}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={module.position[axis as "x" | "z"].toFixed(1)}
                        onChange={(e) => updateTransform("position", axis as "x" | "z", Number(e.target.value))}
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
                    onClick={() => resetTransform("scale")}
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
                      onUpdate({
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
                      onUpdate({
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
                    onValueChange={([value]) => updateDimension(key as "width" | "depth" | "height", value)}
                    min={10}
                    max={200}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={module.dimensions[key as keyof typeof module.dimensions]}
                    onChange={(e) => updateDimension(key as "width" | "depth" | "height", Number(e.target.value))}
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
                    onValueChange={([value]) => updateProperty("slots", value)}
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
                    onCheckedChange={(checked) => updateProperty("orientation", checked ? "horizontal" : "vertical")}
                  />
                </div>
              )}

              {["earring-flap", "removable-tray"].includes(module.type) && (
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Removable</Label>
                  <Switch
                    checked={module.properties?.isRemovable || false}
                    onCheckedChange={(checked) => updateProperty("isRemovable", checked)}
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
