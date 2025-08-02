"use client"

import { Box } from "@react-three/drei"
import type { TrayConfig } from "@/types/tray-types"
import { getMaterial } from "@/utils/materials"

interface TrayDividersProps {
  config: TrayConfig
}

export function TrayDividers({ config }: TrayDividersProps) {
  const { width, depth, height } = config.dimensions
  const { horizontal, vertical } = config.dividers
  const dividerThickness = 4
  const baseThickness = 4

  const material = getMaterial(config.materials.dividers, config.colors.dividers)

  return (
    <group>
      {/* Horizontal dividers */}
      {horizontal.map((position, index) => (
        <Box
          key={`h-${index}`}
          args={[width - 16, height - 8, dividerThickness]}
          position={[0, height / 2 + baseThickness, position - depth / 2]}
          material={material}
          castShadow
        />
      ))}

      {/* Vertical dividers */}
      {vertical.map((position, index) => (
        <Box
          key={`v-${index}`}
          args={[dividerThickness, height - 8, depth - 16]}
          position={[position - width / 2, height / 2 + baseThickness, 0]}
          material={material}
          castShadow
        />
      ))}
    </group>
  )
}
