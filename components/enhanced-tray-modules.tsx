"use client"

import { Box, Cylinder } from "@react-three/drei"
import { useMemo } from "react"
import type { TrayConfig } from "@/types/tray-types"
import { getMaterial } from "@/utils/materials"

interface EnhancedTrayModulesProps {
  config: TrayConfig
  gridCells: Array<{
    row: number
    col: number
    x: number
    z: number
    width: number
    depth: number
  }>
}

export function EnhancedTrayModules({ config, gridCells }: EnhancedTrayModulesProps) {
  const baseThickness = 4

  const moduleComponents = useMemo(() => {
    return config.modules.map((module) => {
      const cell = gridCells.find((c) => c.row === module.cell.row && c.col === module.cell.col)
      if (!cell) return null

      const material = getMaterial(config.materials.modules, config.colors.modules)
      const centerX = cell.x + cell.width / 2
      const centerZ = cell.z + cell.depth / 2
      const moduleHeight = 12

      switch (module.type) {
        case "ring-tray-grooved":
          // Grooved ring tray like in the reference image
          const grooveCount = Math.floor(Math.min(cell.width, cell.depth) / 15)
          return (
            <group key={module.id}>
              {/* Base */}
              <Box
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
              {/* Grooves */}
              {Array.from({ length: grooveCount }, (_, i) => (
                <Box
                  key={i}
                  args={[cell.width - 12, 2, 8]}
                  position={[
                    centerX,
                    baseThickness + moduleHeight - 1,
                    centerZ - (cell.depth - 20) / 2 + (i * (cell.depth - 20)) / (grooveCount - 1),
                  ]}
                  material={material}
                />
              ))}
            </group>
          )

        case "ring-tray-slots":
          // Individual ring slots
          const slotCount = Math.floor(cell.width / 25)
          return (
            <group key={module.id}>
              <Box
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
              {Array.from({ length: slotCount }, (_, i) => (
                <Cylinder
                  key={i}
                  args={[6, 6, moduleHeight + 2]}
                  position={[
                    centerX - (cell.width - 30) / 2 + (i * (cell.width - 30)) / (slotCount - 1),
                    baseThickness + moduleHeight / 2,
                    centerZ,
                  ]}
                  material={material}
                />
              ))}
            </group>
          )

        case "watch-pillow":
          // Curved watch pillow
          return (
            <group key={module.id}>
              <Cylinder
                args={[Math.min(cell.width, cell.depth) / 3, Math.min(cell.width, cell.depth) / 3, moduleHeight]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
              {/* Pillow curve effect */}
              <Cylinder
                args={[Math.min(cell.width, cell.depth) / 4, Math.min(cell.width, cell.depth) / 4, moduleHeight + 4]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
            </group>
          )

        case "watch-pad-flat":
          // Flat watch pad
          return (
            <Box
              key={module.id}
              args={[cell.width - 12, moduleHeight / 2, cell.depth - 12]}
              position={[centerX, baseThickness + moduleHeight / 4, centerZ]}
              material={material}
              castShadow
            />
          )

        case "glasses-insert":
          // Glasses holder with curved supports
          return (
            <group key={module.id}>
              <Box
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
              {/* Nose bridge support */}
              <Cylinder
                args={[4, 4, cell.width - 20]}
                rotation={[0, 0, Math.PI / 2]}
                position={[centerX, baseThickness + moduleHeight + 2, centerZ]}
                material={material}
                castShadow
              />
              {/* Side supports */}
              <Cylinder
                args={[3, 3, cell.depth - 20]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[centerX - cell.width / 3, baseThickness + moduleHeight + 1, centerZ]}
                material={material}
                castShadow
              />
              <Cylinder
                args={[3, 3, cell.depth - 20]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[centerX + cell.width / 3, baseThickness + moduleHeight + 1, centerZ]}
                material={material}
                castShadow
              />
            </group>
          )

        case "earring-flap":
          // Removable earring flap with holes
          const holeCount = Math.floor((cell.width - 20) / 15)
          return (
            <group key={module.id}>
              <Box
                args={[cell.width - 8, 2, cell.depth - 8]}
                position={[centerX, baseThickness + moduleHeight - 1, centerZ]}
                material={material}
                castShadow
              />
              {/* Earring holes */}
              {Array.from({ length: holeCount }, (_, i) =>
                Array.from({ length: Math.floor((cell.depth - 20) / 15) }, (_, j) => (
                  <Cylinder
                    key={`${i}-${j}`}
                    args={[1.5, 1.5, 4]}
                    position={[
                      centerX - (cell.width - 30) / 2 + (i * (cell.width - 30)) / (holeCount - 1),
                      baseThickness + moduleHeight,
                      centerZ -
                        (cell.depth - 30) / 2 +
                        (j * (cell.depth - 30)) / (Math.floor((cell.depth - 20) / 15) - 1),
                    ]}
                    material={material}
                  />
                )),
              )}
            </group>
          )

        case "necklace-hooks":
          // Necklace hooks
          const hookCount = Math.floor(cell.width / 30)
          return (
            <group key={module.id}>
              <Box
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
              {Array.from({ length: hookCount }, (_, i) => (
                <group key={i}>
                  {/* Hook post */}
                  <Cylinder
                    args={[2, 2, moduleHeight + 8]}
                    position={[
                      centerX - (cell.width - 40) / 2 + (i * (cell.width - 40)) / (hookCount - 1),
                      baseThickness + moduleHeight + 4,
                      centerZ,
                    ]}
                    material={material}
                    castShadow
                  />
                  {/* Hook curve */}
                  <Cylinder
                    args={[1, 1, 8]}
                    rotation={[0, 0, Math.PI / 2]}
                    position={[
                      centerX - (cell.width - 40) / 2 + (i * (cell.width - 40)) / (hookCount - 1),
                      baseThickness + moduleHeight + 8,
                      centerZ + 4,
                    ]}
                    material={material}
                    castShadow
                  />
                </group>
              ))}
            </group>
          )

        case "bracelet-bar":
          // Bracelet display bar
          return (
            <group key={module.id}>
              <Box
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
              <Cylinder
                args={[6, 6, cell.width - 20]}
                rotation={[0, 0, Math.PI / 2]}
                position={[centerX, baseThickness + moduleHeight + 6, centerZ]}
                material={material}
                castShadow
              />
            </group>
          )

        case "deep-compartment":
          // Deep storage compartment
          return (
            <Box
              key={module.id}
              args={[cell.width - 8, moduleHeight * 2, cell.depth - 8]}
              position={[centerX, baseThickness + moduleHeight, centerZ]}
              material={material}
              castShadow
            />
          )

        case "cover-flap":
          // Hinged cover flap
          return (
            <group key={module.id}>
              <Box
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
              {/* Flap/lid */}
              <Box
                args={[cell.width - 10, 2, cell.depth - 10]}
                position={[centerX, baseThickness + moduleHeight + 1, centerZ - cell.depth / 4]}
                rotation={[-Math.PI / 6, 0, 0]}
                material={material}
                castShadow
              />
              {/* Hinge */}
              <Cylinder
                args={[1, 1, cell.width - 12]}
                rotation={[0, 0, Math.PI / 2]}
                position={[centerX, baseThickness + moduleHeight, centerZ - cell.depth / 2 + 5]}
                material={material}
                castShadow
              />
            </group>
          )

        case "removable-tray":
          // Removable sub-tray
          return (
            <group key={module.id}>
              {/* Main tray */}
              <Box
                args={[cell.width - 12, moduleHeight, cell.depth - 12]}
                position={[centerX, baseThickness + moduleHeight / 2 + 2, centerZ]}
                material={material}
                castShadow
              />
              {/* Handle notches */}
              <Box
                args={[8, 4, 4]}
                position={[centerX - cell.width / 2 + 4, baseThickness + moduleHeight + 2, centerZ]}
                material={material}
                castShadow
              />
              <Box
                args={[8, 4, 4]}
                position={[centerX + cell.width / 2 - 4, baseThickness + moduleHeight + 2, centerZ]}
                material={material}
                castShadow
              />
            </group>
          )

        case "small-compartment":
        default:
          return (
            <Box
              key={module.id}
              args={[cell.width - 8, moduleHeight, cell.depth - 8]}
              position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
              material={material}
              castShadow
            />
          )
      }
    })
  }, [config.modules, gridCells, config.materials.modules, config.colors.modules, baseThickness])

  return <group>{moduleComponents}</group>
}
