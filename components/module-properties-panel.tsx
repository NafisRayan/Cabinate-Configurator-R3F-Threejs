"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Module } from "@/types/tray-types"

interface ModulePropertiesPanelProps {
  selectedModule: Module | null
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void
}

export function ModulePropertiesPanel({ selectedModule, onUpdateModule }: ModulePropertiesPanelProps) {
  if (!selectedModule) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-sm">Module Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500">Select a module to edit properties</div>
        </CardContent>
      </Card>
    )
  }

  const updateProperty = (key: string, value: any) => {
    onUpdateModule(selectedModule.id, {
      properties: { ...selectedModule.properties, [key]: value },
    })
  }

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-sm">Module Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-xs font-medium">{selectedModule.type.replace(/-/g, " ").toUpperCase()}</div>

        {/* Ring tray specific properties */}
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

        {/* Orientation for certain modules */}
        {["necklace-hooks", "bracelet-bar", "ring-tray-grooved"].includes(selectedModule.type) && (
          <div className="flex items-center justify-between">
            <Label className="text-xs">Horizontal Orientation</Label>
            <Switch
              checked={selectedModule.properties?.orientation === "horizontal"}
              onCheckedChange={(checked) => updateProperty("orientation", checked ? "horizontal" : "vertical")}
            />
          </div>
        )}

        {/* Removable property */}
        {["earring-flap", "removable-tray"].includes(selectedModule.type) && (
          <div className="flex items-center justify-between">
            <Label className="text-xs">Removable</Label>
            <Switch
              checked={selectedModule.properties?.isRemovable || false}
              onCheckedChange={(checked) => updateProperty("isRemovable", checked)}
            />
          </div>
        )}

        {/* Depth setting for compartments */}
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

        {/* Cover flap properties */}
        {selectedModule.type === "cover-flap" && (
          <div className="flex items-center justify-between">
            <Label className="text-xs">Has Lock</Label>
            <Switch
              checked={selectedModule.properties?.hasLid || false}
              onCheckedChange={(checked) => updateProperty("hasLid", checked)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
