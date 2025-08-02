"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import type { Module } from "@/types/tray-types"

interface FloatingModuleMenuProps {
  isOpen: boolean
  onClose: () => void
  onAddModule: (module: Module) => void
  selectedCell: { row: number; col: number } | null
}

const moduleTypes = [
  {
    id: "ring-tray-grooved",
    name: "Ring Tray (Grooved)",
    description: "Parallel grooves for rings",
    category: "Rings",
    icon: "💍",
    keywords: ["ring", "groove", "jewelry"],
  },
  {
    id: "ring-tray-slots",
    name: "Ring Tray (Slots)",
    description: "Individual ring slots",
    category: "Rings",
    icon: "💍",
    keywords: ["ring", "slot", "jewelry"],
  },
  {
    id: "watch-pillow",
    name: "Watch Pillow",
    description: "Curved pillow for watches",
    category: "Watches",
    icon: "⌚",
    keywords: ["watch", "pillow", "curved"],
  },
  {
    id: "watch-pad-flat",
    name: "Watch Pad (Flat)",
    description: "Flat pad for watches",
    category: "Watches",
    icon: "⌚",
    keywords: ["watch", "pad", "flat"],
  },
  {
    id: "glasses-insert",
    name: "Glasses Insert",
    description: "Holder for eyeglasses",
    category: "Accessories",
    icon: "👓",
    keywords: ["glasses", "eyewear", "holder"],
  },
  {
    id: "earring-flap",
    name: "Earring Flap",
    description: "Removable flap with holes",
    category: "Earrings",
    icon: "👂",
    keywords: ["earring", "flap", "holes"],
  },
  {
    id: "necklace-hooks",
    name: "Necklace Hooks",
    description: "Hooks for necklaces",
    category: "Necklaces",
    icon: "📿",
    keywords: ["necklace", "hooks", "chain"],
  },
  {
    id: "bracelet-bar",
    name: "Bracelet Bar",
    description: "Display bar for bracelets",
    category: "Bracelets",
    icon: "🔗",
    keywords: ["bracelet", "bar", "display"],
  },
  {
    id: "deep-compartment",
    name: "Deep Compartment",
    description: "Extra deep storage",
    category: "Storage",
    icon: "📦",
    keywords: ["deep", "storage", "compartment"],
  },
  {
    id: "cover-flap",
    name: "Cover Flap",
    description: "Hinged protective cover",
    category: "Storage",
    icon: "🔒",
    keywords: ["cover", "flap", "protection"],
  },
  {
    id: "removable-tray",
    name: "Removable Tray",
    description: "Lift-out sub-tray",
    category: "Storage",
    icon: "📤",
    keywords: ["removable", "tray", "lift"],
  },
  {
    id: "small-compartment",
    name: "Small Compartment",
    description: "Basic storage compartment",
    category: "Storage",
    icon: "📦",
    keywords: ["small", "storage", "basic"],
  },
]

export function FloatingModuleMenu({ isOpen, onClose, onAddModule }: FloatingModuleMenuProps) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!isOpen) return null

  const filteredModules = moduleTypes.filter((module) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      module.name.toLowerCase().includes(searchLower) ||
      module.description.toLowerCase().includes(searchLower) ||
      module.category.toLowerCase().includes(searchLower) ||
      module.keywords.some((keyword) => keyword.includes(searchLower))
    )
  })

  const modulesByCategory = filteredModules.reduce(
    (acc, module) => {
      if (!acc[module.category]) {
        acc[module.category] = []
      }
      acc[module.category].push(module)
      return acc
    },
    {} as Record<string, typeof moduleTypes>,
  )

  const addModule = (type: string) => {
    const module: Module = {
      id: Math.random().toString(36).substr(2, 9),
      type: type as Module["type"],
      cell: { row: -1, col: -1 }, // Unplaced initially
      dimensions: { width: 50, depth: 50, height: 20 },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      isSelected: false,
      isHovered: false,
    }

    onAddModule(module)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Add Module</CardTitle>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
            💡 Modules will be added to the sidebar. Drag them to cells to place them.
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-96">
          <div className="space-y-4">
            {Object.entries(modulesByCategory).map(([category, categoryModules]) => (
              <div key={category}>
                <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span>{category}</span>
                  <Badge variant="outline" className="text-xs">
                    {categoryModules.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {categoryModules.map((moduleType) => (
                    <Button
                      key={moduleType.id}
                      variant="outline"
                      onClick={() => addModule(moduleType.id)}
                      className="w-full text-left justify-start p-3 h-auto hover:bg-blue-50"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{moduleType.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{moduleType.name}</div>
                          <div className="text-gray-500 text-xs">{moduleType.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            {filteredModules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-sm">No modules found</div>
                <div className="text-xs mt-1">Try a different search term</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
