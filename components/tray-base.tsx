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
        position={[width / 2, baseThickness / 2, depth / 2]}
        material={material}
        castShadow
        receiveShadow
      />

      {/* Walls */}
      {/* Front wall */}
      <Box
        args={[width, height, wallThickness]}
        position={[width / 2, height / 2 + baseThickness, wallThickness / 2]}
        material={material}
        castShadow
      />

      {/* Back wall */}
      <Box
        args={[width, height, wallThickness]}
        position={[width / 2, height / 2 + baseThickness, depth - wallThickness / 2]}
        material={material}
        castShadow
      />

      {/* Left wall */}
      <Box
        args={[wallThickness, height, depth]}
        position={[wallThickness / 2, height / 2 + baseThickness, depth / 2]}
        material={material}
        castShadow
      />

      {/* Right wall */}
      <Box
        args={[wallThickness, height, depth]}
        position={[width - wallThickness / 2, height / 2 + baseThickness, depth / 2]}
        material={material}
        castShadow
      />
    </group>
  )
}
