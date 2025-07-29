"use client"

import { Box, Cylinder } from "@react-three/drei"
import type { TrayConfig } from "@/types/tray-types"
import { getMaterial } from "@/utils/materials"

interface TrayModulesProps {
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

export function TrayModules({ config, gridCells }: TrayModulesProps) {
  const baseThickness = 4

  return (
    <group>
      {config.modules.map((module) => {
        const cell = gridCells.find((c) => c.row === module.cell.row && c.col === module.cell.col)
        if (!cell) return null

        const material = getMaterial(config.materials.modules, config.colors.modules)
        const centerX = cell.x + cell.width / 2
        const centerZ = cell.z + cell.depth / 2
        const moduleHeight = 8

        switch (module.type) {
          case "ring-tray":
            return (
              <group key={module.id}>
                {/* Ring tray base */}
                <Box
                  args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                  position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                  material={material}
                  castShadow
                />
                {/* Ring slots */}
                {Array.from({ length: 3 }, (_, i) => (
                  <Cylinder
                    key={i}
                    args={[8, 8, moduleHeight + 2]}
                    position={[centerX - 20 + i * 20, baseThickness + moduleHeight / 2, centerZ]}
                    material={material}
                  />
                ))}
              </group>
            )

          case "watch-pillow":
            return (
              <Cylinder
                key={module.id}
                args={[Math.min(cell.width, cell.depth) / 3, Math.min(cell.width, cell.depth) / 3, moduleHeight]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
            )

          case "small-compartment":
            return (
              <Box
                key={module.id}
                args={[cell.width - 8, moduleHeight, cell.depth - 8]}
                position={[centerX, baseThickness + moduleHeight / 2, centerZ]}
                material={material}
                castShadow
              />
            )

          default:
            return null
        }
      })}
    </group>
  )
}
