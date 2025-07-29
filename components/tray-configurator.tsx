"use client"

import { useState, useRef, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid } from "@react-three/drei"
import { TrayScene } from "./tray-scene"
import { ConfigPanel } from "./config-panel"
import { ViewControls } from "./view-controls"
import { MaterialPanel } from "./material-panel"
import { ModulePanel } from "./module-panel"
import { SaveLoadPanel } from "./save-load-panel"
import type { TrayConfig, Module, ViewMode } from "@/types/tray-types"
import { ModulePropertiesPanel } from "./module-properties-panel"

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
  },
  colors: {
    base: "#D2B48C",
    dividers: "#D2B48C",
    modules: "#2C2C2C",
  },
}

export function TrayConfigurator() {
  const [config, setConfig] = useState<TrayConfig>(defaultConfig)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("perspective")
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

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

      setConfig((prev) => ({
        ...prev,
        modules: [
          ...prev.modules.filter((m) => !(m.cell.row === selectedCell.row && m.cell.col === selectedCell.col)),
          module,
        ],
      }))
    },
    [selectedCell],
  )

  const removeModule = useCallback((moduleId: string) => {
    setConfig((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== moduleId),
    }))
  }, [])

  const updateModule = useCallback((moduleId: string, updates: Partial<Module>) => {
    setConfig((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)),
    }))
  }, [])

  const saveDesign = useCallback(async () => {
    setIsLoading(true)
    try {
      // In a real app, this would save to MongoDB
      const designData = {
        ...config,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9),
      }

      localStorage.setItem("tray-design", JSON.stringify(designData))
      console.log("Design saved:", designData)
    } catch (error) {
      console.error("Failed to save design:", error)
    } finally {
      setIsLoading(false)
    }
  }, [config])

  const loadDesign = useCallback(async () => {
    setIsLoading(true)
    try {
      // In a real app, this would load from MongoDB
      const savedDesign = localStorage.getItem("tray-design")
      if (savedDesign) {
        const designData = JSON.parse(savedDesign)
        setConfig(designData)
        console.log("Design loaded:", designData)
      }
    } catch (error) {
      console.error("Failed to load design:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex h-screen">
      {/* Left Panel - Configuration */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Tray Configurator</h1>
        </div>

        <ConfigPanel
          config={config}
          onUpdateConfig={updateConfig}
          onAddDivider={addDivider}
          onRemoveDivider={removeDivider}
        />

        <MaterialPanel config={config} onUpdateConfig={updateConfig} />

        <ModulePanel
          selectedCell={selectedCell}
          onAddModule={addModule}
          onRemoveModule={removeModule}
          modules={config.modules}
        />

        <ModulePropertiesPanel selectedModule={selectedModule} onUpdateModule={updateModule} />

        <SaveLoadPanel onSave={saveDesign} onLoad={loadDesign} isLoading={isLoading} />
      </div>

      {/* Main 3D View */}
      <div className="flex-1 relative">
        <ViewControls viewMode={viewMode} onViewModeChange={setViewMode} />

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

          <TrayScene config={config} selectedCell={selectedCell} onCellSelect={setSelectedCell} viewMode={viewMode} />

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
