"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Move, Maximize, Settings } from "lucide-react"
import type { Module } from "@/types/tray-types"

interface ObjectPropertiesPanelProps {
  selectedModule: Module | null
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void
}

export function ObjectPropertiesPanel({ selectedModule, onUpdateModule }: ObjectPropertiesPanelProps) {
  if (!selectedModule) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Object Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium">Select an Object</div>
            <div className="text-xs mt-1">Click on a module in the 3D view to edit its properties</div>
            <div className="text-xs mt-2 text-gray-400">
              Use <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">G</kbd> to move,{" "}
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">R</kbd> to rotate,{" "}
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">S</kbd> to scale
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const updateProperty = (key: string, value: any) => {
    onUpdateModule(selectedModule.id, {
      properties: { ...selectedModule.properties, [key]: value },
    })
  }

  const updateTransform = (type: "position" | "rotation" | "scale", axis: "x" | "y" | "z", value: number) => {
    onUpdateModule(selectedModule.id, {
      [type]: { ...selectedModule[type], [axis]: value },
    })
  }

  const updateDimension = (axis: "width" | "depth" | "height", value: number) => {
    onUpdateModule(selectedModule.id, {
      dimensions: { ...selectedModule.dimensions, [axis]: value },
    })
  }

  const resetTransform = (type: "position" | "rotation" | "scale") => {
    const defaultValues = {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    }
    onUpdateModule(selectedModule.id, { [type]: defaultValues[type] })
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Object Properties
          </div>
          <Badge variant="secondary">Selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs font-medium bg-blue-50 p-2 rounded">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{selectedModule.type.replace(/-/g, " ").toUpperCase()}</span>
          </div>
          <div className="text-gray-600 mt-1">
            Cell: Row {selectedModule.cell.row + 1}, Col {selectedModule.cell.col + 1}
          </div>
        </div>

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

          <TabsContent value="transform" className="space-y-4">
            {/* Position */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium">Position</Label>
                <Button size="sm" variant="outline" onClick={() => resetTransform("position")} className="h-6 text-xs">
                  Reset
                </Button>
              </div>
              <div className="space-y-2">
                {["x", "z"].map((axis) => (
                  <div key={axis} className="flex items-center gap-2">
                    <Label className="text-xs w-4 uppercase">{axis}:</Label>
                    <Slider
                      value={[selectedModule.position[axis as "x" | "z"]]}
                      onValueChange={([value]) => updateTransform("position", axis as "x" | "z", value)}
                      min={-100}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={selectedModule.position[axis as "x" | "z"].toFixed(1)}
                      onChange={(e) => updateTransform("position", axis as "x" | "z", Number(e.target.value))}
                      className="w-16 h-6 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Rotation */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium">Rotation (degrees)</Label>
                <Button size="sm" variant="outline" onClick={() => resetTransform("rotation")} className="h-6 text-xs">
                  Reset
                </Button>
              </div>
              <div className="space-y-2">
                {["x", "y", "z"].map((axis) => (
                  <div key={axis} className="flex items-center gap-2">
                    <Label className="text-xs w-4 uppercase">{axis}:</Label>
                    <Slider
                      value={[selectedModule.rotation[axis as "x" | "y" | "z"]]}
                      onValueChange={([value]) => updateTransform("rotation", axis as "x" | "y" | "z", value)}
                      min={-180}
                      max={180}
                      step={5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={selectedModule.rotation[axis as "x" | "y" | "z"].toFixed(0)}
                      onChange={(e) => updateTransform("rotation", axis as "x" | "y" | "z", Number(e.target.value))}
                      className="w-16 h-6 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-medium">Scale</Label>
                <Button size="sm" variant="outline" onClick={() => resetTransform("scale")} className="h-6 text-xs">
                  Reset
                </Button>
              </div>
              <div className="space-y-2">
                {["x", "y", "z"].map((axis) => (
                  <div key={axis} className="flex items-center gap-2">
                    <Label className="text-xs w-4 uppercase">{axis}:</Label>
                    <Slider
                      value={[selectedModule.scale[axis as "x" | "y" | "z"]]}
                      onValueChange={([value]) => updateTransform("scale", axis as "x" | "y" | "z", value)}
                      min={0.1}
                      max={3}
                      step={0.1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={selectedModule.scale[axis as "x" | "y" | "z"].toFixed(2)}
                      onChange={(e) => updateTransform("scale", axis as "x" | "y" | "z", Number(e.target.value))}
                      className="w-16 h-6 text-xs"
                      step={0.1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="space-y-4">
            <div>
              <Label className="text-xs font-medium mb-2 block">Dimensions (mm)</Label>
              <div className="space-y-2">
                {[
                  { key: "width", label: "Width" },
                  { key: "depth", label: "Depth" },
                  { key: "height", label: "Height" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <Label className="text-xs w-12">{label}:</Label>
                    <Slider
                      value={[selectedModule.dimensions[key as keyof typeof selectedModule.dimensions]]}
                      onValueChange={([value]) => updateDimension(key as "width" | "depth" | "height", value)}
                      min={10}
                      max={200}
                      step={1}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={selectedModule.dimensions[key as keyof typeof selectedModule.dimensions]}
                      onChange={(e) => updateDimension(key as "width" | "depth" | "height", Number(e.target.value))}
                      className="w-16 h-6 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            {/* Module-specific properties */}
            {(selectedModule.type === "ring-tray-grooved" || selectedModule.type === "ring-tray-slots") && (
              <div>
                <Label className="text-xs">Number of Slots/Grooves</Label>
                <Slider
                  value={[selectedModule.properties?.slots || 5]}
                  onValueChange={([value]) => updateProperty("slots", value)}
                  min={3}
                  max={12}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-gray-500 mt-1">{selectedModule.properties?.slots || 5} slots</div>
              </div>
            )}

            {["necklace-hooks", "bracelet-bar", "ring-tray-grooved"].includes(selectedModule.type) && (
              <div className="flex items-center justify-between">
                <Label className="text-xs">Horizontal Orientation</Label>
                <Switch
                  checked={selectedModule.properties?.orientation === "horizontal"}
                  onCheckedChange={(checked) => updateProperty("orientation", checked ? "horizontal" : "vertical")}
                />
              </div>
            )}

            {["earring-flap", "removable-tray"].includes(selectedModule.type) && (
              <div className="flex items-center justify-between">
                <Label className="text-xs">Removable</Label>
                <Switch
                  checked={selectedModule.properties?.isRemovable || false}
                  onCheckedChange={(checked) => updateProperty("isRemovable", checked)}
                />
              </div>
            )}

            {["deep-compartment", "small-compartment"].includes(selectedModule.type) && (
              <div>
                <Label className="text-xs">Compartment Depth</Label>
                <div className="flex gap-2 mt-2">
                  {["shallow", "medium", "deep"].map((depth) => (
                    <Button
                      key={depth}
                      size="sm"
                      variant={selectedModule.properties?.depth === depth ? "default" : "outline"}
                      onClick={() => updateProperty("depth", depth)}
                      className="text-xs"
                    >
                      {depth}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedModule.type === "cover-flap" && (
              <div className="flex items-center justify-between">
                <Label className="text-xs">Has Lock</Label>
                <Switch
                  checked={selectedModule.properties?.hasLid || false}
                  onCheckedChange={(checked) => updateProperty("hasLid", checked)}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Keyboard Shortcuts */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <div className="font-medium mb-1">Keyboard Shortcuts:</div>
          <div className="space-y-1">
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">G</kbd> - Grab/Move
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">R</kbd> - Rotate
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">S</kbd> - Scale
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">X/Y/Z</kbd> - Constrain to axis
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Del</kbd> - Delete
            </div>
            <div>
              <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Shift+D</kbd> - Duplicate
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
