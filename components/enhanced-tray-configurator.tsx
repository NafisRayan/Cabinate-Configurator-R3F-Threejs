"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid } from "@react-three/drei"
import { TrayScene } from "./tray-scene"
import { EnhancedConfigPanel } from "./enhanced-config-panel"
import { ViewControls } from "./view-controls"
import { EnhancedMaterialPanel } from "./enhanced-material-panel"
import { EnhancedModulePanel } from "./enhanced-module-panel"
import { ObjectPropertiesPanel } from "./object-properties-panel"
import { ExportPanel } from "./export-panel"
import { DesignOverview } from "./design-overview"
import { BlenderControls } from "./blender-controls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Save, FolderOpen, Plus } from "lucide-react"
import type { TrayConfig, Module, ViewMode, SavedDesign, TransformMode } from "@/types/tray-types"
import { DesignManager } from "@/utils/design-manager"

const defaultConfig: TrayConfig = {
  dimensions: { width: 300, depth: 200, height: 40 },
  dividers: {
    horizontal: [],
    vertical: [],
  },
  modules: [],
  materials: {
    base: "leather-tan",
    dividers: "leather-tan",
    modules: "velvet-black",
    bottom: "flannel",
  },
  colors: {
    base: "#D2B48C",
    dividers: "#D2B48C",
    modules: "#2C2C2C",
  },
  thickness: {
    base: 3,
    dividers: 5,
  },
  hasTopCover: false,
}

export function EnhancedTrayConfigurator() {
  const [config, setConfig] = useState<TrayConfig>(defaultConfig)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("perspective")
  const [transformMode, setTransformMode] = useState<TransformMode>("translate")
  const [isLoading, setIsLoading] = useState(false)
  const [currentDesign, setCurrentDesign] = useState<SavedDesign | null>(null)
  const [designName, setDesignName] = useState("")
  const [showOverview, setShowOverview] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const designManager = DesignManager.getInstance()

  // Auto-save functionality
  useEffect(() => {
    if (currentDesign) {
      setHasUnsavedChanges(true)
      const autoSaveTimer = setTimeout(() => {
        handleSave(true) // Auto-save
      }, 30000) // Auto-save every 30 seconds

      return () => clearTimeout(autoSaveTimer)
    }
  }, [config])

  const updateConfig = useCallback((updates: Partial<TrayConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }))
  }, [])

  const addDivider = useCallback((type: "horizontal" | "vertical", position: number) => {
    setConfig((prev) => ({
      ...prev,
      dividers: {
        ...prev.dividers,
        [type]: [...prev.dividers[type], position].sort((a, b) => a - b),
      },
    }))
  }, [])

  const removeDivider = useCallback((type: "horizontal" | "vertical", index: number) => {
    setConfig((prev) => ({
      ...prev,
      dividers: {
        ...prev.dividers,
        [type]: prev.dividers[type].filter((_, i) => i !== index),
      },
    }))
  }, [])

  const addModule = useCallback(
    (module: Module) => {
      if (!selectedCell) return

      // Add default transform properties
      const moduleWithTransforms = {
        ...module,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        isSelected: false,
        isHovered: false,
      }

      setConfig((prev) => ({
        ...prev,
        modules: [
          ...prev.modules.filter((m) => !(m.cell.row === selectedCell.row && m.cell.col === selectedCell.col)),
          moduleWithTransforms,
        ],
      }))

      // Auto-select the new module
      setSelectedModuleId(moduleWithTransforms.id)
    },
    [selectedCell],
  )

  const removeModule = useCallback(
    (moduleId: string) => {
      setConfig((prev) => ({
        ...prev,
        modules: prev.modules.filter((m) => m.id !== moduleId),
      }))
      if (selectedModuleId === moduleId) {
        setSelectedModuleId(null)
      }
    },
    [selectedModuleId],
  )

  const updateModule = useCallback((moduleId: string, updates: Partial<Module>) => {
    setConfig((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)),
    }))
  }, [])

  const duplicateModule = useCallback(
    (moduleId: string) => {
      const moduleToClone = config.modules.find((m) => m.id === moduleId)
      if (!moduleToClone) return

      const clonedModule: Module = {
        ...moduleToClone,
        id: Math.random().toString(36).substr(2, 9),
        position: {
          x: moduleToClone.position.x + 20,
          y: moduleToClone.position.y,
          z: moduleToClone.position.z + 20,
        },
      }

      setConfig((prev) => ({
        ...prev,
        modules: [...prev.modules, clonedModule],
      }))

      setSelectedModuleId(clonedModule.id)
    },
    [config.modules],
  )

  const handleModuleHover = useCallback((moduleId: string | null) => {
    setConfig((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => ({ ...m, isHovered: m.id === moduleId })),
    }))
  }, [])

  const selectedModule = config.modules.find((m) => m.id === selectedModuleId) || null

  const handleSave = async (isAutoSave = false) => {
    setIsLoading(true)
    try {
      const name = designName || `Design ${new Date().toLocaleDateString()}`
      const savedDesign = await designManager.saveDesign(config, currentDesign?.designCode, name)

      setCurrentDesign(savedDesign)
      setHasUnsavedChanges(false)

      if (!isAutoSave) {
        console.log(`Design saved as ${savedDesign.designCode} v${savedDesign.version}`)
      }
    } catch (error) {
      console.error("Failed to save design:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadDesign = (design: SavedDesign) => {
    setConfig(design.config)
    setCurrentDesign(design)
    setDesignName(design.name)
    setHasUnsavedChanges(false)
    setShowOverview(false)
    setSelectedModuleId(null)
  }

  const handleNewDesign = () => {
    if (hasUnsavedChanges && !confirm("You have unsaved changes. Continue?")) {
      return
    }

    setConfig(defaultConfig)
    setCurrentDesign(null)
    setDesignName("")
    setHasUnsavedChanges(false)
    setSelectedCell(null)
    setSelectedModuleId(null)
  }

  const handleRequestQuote = (designs: SavedDesign[]) => {
    console.log(
      "Quote requested for designs:",
      designs.map((d) => d.designCode),
    )
  }

  if (showOverview) {
    return (
      <div className="h-screen bg-gray-100">
        <div className="p-4 bg-white border-b flex items-center justify-between">
          <h1 className="text-xl font-bold">Design Overview</h1>
          <Button onClick={() => setShowOverview(false)}>Back to Editor</Button>
        </div>
        <DesignOverview onLoadDesign={handleLoadDesign} onRequestQuote={handleRequestQuote} />
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Blender-style Controls */}
      <BlenderControls
        selectedModule={selectedModule}
        onUpdateModule={updateModule}
        onDeleteModule={removeModule}
        onDuplicateModule={duplicateModule}
        transformMode={transformMode}
        onTransformModeChange={setTransformMode}
      />

      {/* Left Panel - Configuration */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Tray Configurator</h1>
            {currentDesign && (
              <Badge variant="secondary">
                #{currentDesign.designCode} v{currentDesign.version}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleNewDesign}>
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowOverview(true)}>
              <FolderOpen className="w-4 h-4 mr-1" />
              Overview
            </Button>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Design name..."
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="text-sm"
            />
            <Button onClick={() => handleSave()} disabled={isLoading} className="w-full" size="sm">
              <Save className="w-4 h-4 mr-1" />
              {isLoading ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Save Design"}
            </Button>
          </div>
        </div>

        <EnhancedConfigPanel
          config={config}
          onUpdateConfig={updateConfig}
          onAddDivider={addDivider}
          onRemoveDivider={removeDivider}
        />

        <EnhancedMaterialPanel config={config} onUpdateConfig={updateConfig} />

        <EnhancedModulePanel
          selectedCell={selectedCell}
          onAddModule={addModule}
          onRemoveModule={removeModule}
          onSelectModule={setSelectedModuleId}
          onDuplicateModule={duplicateModule}
          modules={config.modules}
          selectedModuleId={selectedModuleId}
        />

        <ObjectPropertiesPanel selectedModule={selectedModule} onUpdateModule={updateModule} />

        <ExportPanel config={config} designCode={currentDesign?.designCode} />
      </div>

      {/* Main 3D View */}
      <div className="flex-1 relative">
        <ViewControls viewMode={viewMode} onViewModeChange={setViewMode} />

        {hasUnsavedChanges && (
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="destructive">Unsaved Changes</Badge>
          </div>
        )}

        {selectedModule && (
          <div className="absolute top-16 left-4 z-10">
            <Badge variant="default">
              {transformMode.toUpperCase()} Mode - {selectedModule.type.replace(/-/g, " ")}
            </Badge>
          </div>
        )}

        <Canvas ref={canvasRef} camera={{ position: [400, 300, 400], fov: 50 }} shadows className="bg-gray-50">
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <TrayScene
            config={config}
            selectedCell={selectedCell}
            onCellSelect={setSelectedCell}
            selectedModuleId={selectedModuleId}
            onSelectModule={setSelectedModuleId}
            onHoverModule={handleModuleHover}
            viewMode={viewMode}
          />

          <Grid
            args={[1000, 1000]}
            position={[0, -0.1, 0]}
            cellSize={50}
            cellThickness={0.5}
            cellColor="#e0e0e0"
            sectionSize={200}
            sectionThickness={1}
            sectionColor="#c0c0c0"
            fadeDistance={800}
            fadeStrength={1}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={viewMode === "perspective"}
            maxPolarAngle={viewMode === "top" ? 0 : Math.PI / 2}
            minPolarAngle={viewMode === "top" ? 0 : 0}
          />
        </Canvas>
      </div>
    </div>
  )
}
