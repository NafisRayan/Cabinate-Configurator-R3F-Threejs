"use client"

import { useState, useRef } from "react"
import { Plane } from "@react-three/drei"
import { MeshBasicMaterial } from "three"
import { useFrame } from "@react-three/fiber"

interface DroppableCellHighlightProps {
  cell: {
    x: number
    z: number
    width: number
    depth: number
    row: number
    col: number
  }
  isSelected: boolean
  isDropTarget: boolean
  onClick: () => void
  onDrop: (row: number, col: number) => void
}

export function DroppableCellHighlight({
  cell,
  isSelected,
  isDropTarget,
  onClick,
  onDrop,
}: DroppableCellHighlightProps) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<any>(null)

  const centerX = cell.x + cell.width / 2
  const centerZ = cell.z + cell.depth / 2

  // Animate drop target
  useFrame((state) => {
    if (meshRef.current && isDropTarget) {
      meshRef.current.position.y = 5 + Math.sin(state.clock.elapsedTime * 4) * 1
    } else if (meshRef.current) {
      meshRef.current.position.y = 5
    }
  })

  const getColor = () => {
    if (isDropTarget) return "#10b981" // Green for drop target
    if (isSelected) return "#3b82f6" // Blue for selected
    if (hovered) return "#60a5fa" // Light blue for hover
    return "transparent"
  }

  const getOpacity = () => {
    if (isDropTarget) return 0.6
    if (isSelected) return 0.3
    if (hovered) return 0.2
    return 0
  }

  const material = new MeshBasicMaterial({
    color: getColor(),
    opacity: getOpacity(),
    transparent: true,
  })

  const handleClick = (e: any) => {
    e.stopPropagation()

    // Check if we're dropping a module
    const draggedModuleId = sessionStorage.getItem("draggedModuleId")
    if (draggedModuleId) {
      onDrop(cell.row, cell.col)
      sessionStorage.removeItem("draggedModuleId")
    } else {
      onClick()
    }
  }

  return (
    <Plane
      ref={meshRef}
      args={[cell.width - 4, cell.depth - 4]}
      position={[centerX, 5, centerZ]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
    />
  )
}
