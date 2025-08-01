"use client"

import { useState, useRef } from "react"
import { Plane } from "@react-three/drei"
import { MeshBasicMaterial } from "three"
import { useFrame } from "@react-three/fiber"

interface CellHighlightProps {
  cell: {
    x: number
    z: number
    width: number
    depth: number
  }
  isSelected: boolean
  isPlacementTarget: boolean
  onClick: () => void
}

export function CellHighlight({ cell, isSelected, isPlacementTarget, onClick }: CellHighlightProps) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<any>(null)

  const centerX = cell.x + cell.width / 2
  const centerZ = cell.z + cell.depth / 2

  // Animate placement target
  useFrame((state) => {
    if (meshRef.current && isPlacementTarget) {
      meshRef.current.position.y = 5 + Math.sin(state.clock.elapsedTime * 3) * 2
    } else if (meshRef.current) {
      meshRef.current.position.y = 5
    }
  })

  const getColor = () => {
    if (isPlacementTarget) return "#10b981" // Green for placement target
    if (isSelected) return "#3b82f6" // Blue for selected
    if (hovered) return "#60a5fa" // Light blue for hover
    return "transparent"
  }

  const getOpacity = () => {
    if (isPlacementTarget) return 0.7
    if (isSelected) return 0.3
    if (hovered) return 0.2
    return 0
  }

  const material = new MeshBasicMaterial({
    color: getColor(),
    opacity: getOpacity(),
    transparent: true,
  })

  return (
    <Plane
      ref={meshRef}
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
