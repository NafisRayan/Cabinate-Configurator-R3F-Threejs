"use client"

import { Box } from "@react-three/drei"
import type { TrayConfig } from "@/types/tray-types"
import { getMaterial } from "@/utils/materials"

interface TrayBaseProps {
  config: TrayConfig
}

export function TrayBase({ config }: TrayBaseProps) {
  const { width, depth, height } = config.dimensions
  const wallThickness = 8
  const baseThickness = 4

  const material = getMaterial(config.materials.base, config.colors.base)

  return (
    <group>
      {/* Base */}
      <Box
        args={[width, baseThickness, depth]}
        position={[0, baseThickness / 2, 0]}
        material={material}
        castShadow
        receiveShadow
      />

      {/* Walls */}
      {/* Front wall */}
      <Box
        args={[width, height, wallThickness]}
        position={[0, height / 2 + baseThickness, -depth / 2 + wallThickness / 2]}
        material={material}
        castShadow
      />

      {/* Back wall */}
      <Box
        args={[width, height, wallThickness]}
        position={[0, height / 2 + baseThickness, depth / 2 - wallThickness / 2]}
        material={material}
        castShadow
      />

      {/* Left wall */}
      <Box
        args={[wallThickness, height, depth]}
        position={[-width / 2 + wallThickness / 2, height / 2 + baseThickness, 0]}
        material={material}
        castShadow
      />

      {/* Right wall */}
      <Box
        args={[wallThickness, height, depth]}
        position={[width / 2 - wallThickness / 2, height / 2 + baseThickness, 0]}
        material={material}
        castShadow
      />
    </group>
  )
}
