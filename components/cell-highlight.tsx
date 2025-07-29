"use client"

import { useState } from "react"
import { Plane } from "@react-three/drei"
import { MeshBasicMaterial } from "three"

interface CellHighlightProps {
  cell: {
    x: number
    z: number
    width: number
    depth: number
  }
  isSelected: boolean
  onClick: () => void
}

export function CellHighlight({ cell, isSelected, onClick }: CellHighlightProps) {
  const [hovered, setHovered] = useState(false)

  const centerX = cell.x + cell.width / 2
  const centerZ = cell.z + cell.depth / 2

  const material = new MeshBasicMaterial({
    color: isSelected ? "#3b82f6" : hovered ? "#60a5fa" : "transparent",
    opacity: isSelected ? 0.3 : hovered ? 0.2 : 0,
    transparent: true,
  })

  return (
    <Plane
      args={[cell.width - 4, cell.depth - 4]}
      position={[centerX, 5, centerZ]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    />
  )
}
