"use client"

import { useRef, useMemo } from "react"
import { Box, Cylinder } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import type { TrayConfig } from "@/types/tray-types"
import { getMaterial } from "@/utils/materials"

interface InteractiveTrayModulesProps {
  config: TrayConfig
  gridCells: Array<{
    row: number
    col: number
    x: number
    z: number
    width: number
    depth: number
  }>
  selectedModuleId: string | null
  onSelectModule: (moduleId: string | null) => void
  onHoverModule: (moduleId: string | null) => void
}

export function InteractiveTrayModules({
  config,
  gridCells,
  selectedModuleId,
  onSelectModule,
  onHoverModule,
}: InteractiveTrayModulesProps) {
  const baseThickness = 4
  const groupRefs = useRef<{ [key: string]: Mesh }>({})

  // Animate selected module
  useFrame((state) => {
    if (selectedModuleId && groupRefs.current[selectedModuleId]) {
      const mesh = groupRefs.current[selectedModuleId]
      mesh.position.y = baseThickness + 6 + Math.sin(state.clock.elapsedTime * 2) * 2
    }
  })

  const moduleComponents = useMemo(() => {
    return config.modules.map((module) => {
      const cell = gridCells.find((c) => c.row === module.cell.row && c.col === module.cell.col)
      if (!cell) return null

      const material = getMaterial(config.materials.modules, config.colors.modules)
      const centerX = cell.x + cell.width / 2 + module.position.x
      const centerZ = cell.z + cell.depth / 2 + module.position.z
      const moduleHeight = 12

      const isSelected = selectedModuleId === module.id
      const isHovered = module.isHovered

      // Apply transforms
      const position: [number, number, number] = [
        centerX,
        baseThickness + moduleHeight / 2 + module.position.y,
        centerZ,
      ]
      const rotation: [number, number, number] = [
        (module.rotation.x * Math.PI) / 180,
        (module.rotation.y * Math.PI) / 180,
        (module.rotation.z * Math.PI) / 180,
      ]
      const scale: [number, number, number] = [module.scale.x, module.scale.y, module.scale.z]

      const handleClick = (e: any) => {
        e.stopPropagation()
        onSelectModule(isSelected ? null : module.id)
      }

      const handlePointerEnter = () => {
        onHoverModule(module.id)
        document.body.style.cursor = "pointer"
      }

      const handlePointerLeave = () => {
        onHoverModule(null)
        document.body.style.cursor = "default"
      }

      // Create outline material for selection
      const outlineMaterial = getMaterial(config.materials.modules, isSelected ? "#3b82f6" : "#60a5fa")

      switch (module.type) {
        case "ring-tray-grooved":
          const grooveCount = module.properties?.slots || Math.floor(Math.min(cell.width, cell.depth) / 15)
          return (
            <group
              key={module.id}
              position={position}
              rotation={rotation}
              scale={scale}
              onClick={handleClick}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
            >
              {/* Selection outline */}
              {(isSelected || isHovered) && (
                <Box
                  args={[cell.width - 6, moduleHeight + 2, cell.depth - 6]}
                  material={outlineMaterial}
                  transparent
                  opacity={0.3}
                />
              )}
              {/* Base */}
              <Box
                ref={(ref) => {
                  if (ref) groupRefs.current[module.id] = ref
                }}
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                material={material}
                castShadow
              />
              {/* Grooves */}
              {Array.from({ length: grooveCount }, (_, i) => (
                <Box
                  key={i}
                  args={[cell.width - 12, 2, 8]}
                  position={[
                    0,
                    moduleHeight / 2 - 1,
                    -(cell.depth - 20) / 2 + (i * (cell.depth - 20)) / (grooveCount - 1),
                  ]}
                  material={material}
                />
              ))}
            </group>
          )

        case "ring-tray-slots":
          const slotCount = module.properties?.slots || Math.floor(cell.width / 25)
          return (
            <group
              key={module.id}
              position={position}
              rotation={rotation}
              scale={scale}
              onClick={handleClick}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
            >
              {(isSelected || isHovered) && (
                <Box
                  args={[cell.width - 6, moduleHeight + 2, cell.depth - 6]}
                  material={outlineMaterial}
                  transparent
                  opacity={0.3}
                />
              )}
              <Box
                ref={(ref) => {
                  if (ref) groupRefs.current[module.id] = ref
                }}
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                material={material}
                castShadow
              />
              {Array.from({ length: slotCount }, (_, i) => (
                <Cylinder
                  key={i}
                  args={[6, 6, moduleHeight + 2]}
                  position={[-(cell.width - 30) / 2 + (i * (cell.width - 30)) / (slotCount - 1), 0, 0]}
                  material={material}
                />
              ))}
            </group>
          )

        case "watch-pillow":
          return (
            <group
              key={module.id}
              position={position}
              rotation={rotation}
              scale={scale}
              onClick={handleClick}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
            >
              {(isSelected || isHovered) && (
                <Cylinder
                  args={[
                    Math.min(cell.width, cell.depth) / 3 + 2,
                    Math.min(cell.width, cell.depth) / 3 + 2,
                    moduleHeight + 2,
                  ]}
                  material={outlineMaterial}
                  transparent
                  opacity={0.3}
                />
              )}
              <Cylinder
                ref={(ref) => {
                  if (ref) groupRefs.current[module.id] = ref
                }}
                args={[Math.min(cell.width, cell.depth) / 3, Math.min(cell.width, cell.depth) / 3, moduleHeight]}
                material={material}
                castShadow
              />
              <Cylinder
                args={[Math.min(cell.width, cell.depth) / 4, Math.min(cell.width, cell.depth) / 4, moduleHeight + 4]}
                material={material}
                castShadow
              />
            </group>
          )

        default:
          return (
            <group
              key={module.id}
              position={position}
              rotation={rotation}
              scale={scale}
              onClick={handleClick}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
            >
              {(isSelected || isHovered) && (
                <Box
                  args={[cell.width - 6, moduleHeight + 2, cell.depth - 6]}
                  material={outlineMaterial}
                  transparent
                  opacity={0.3}
                />
              )}
              <Box
                ref={(ref) => {
                  if (ref) groupRefs.current[module.id] = ref
                }}
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                material={material}
                castShadow
              />
            </group>
          )
      }
    })
  }, [config.modules, gridCells, config.materials.modules, config.colors.modules, selectedModuleId, baseThickness])

  return <group>{moduleComponents}</group>
}
