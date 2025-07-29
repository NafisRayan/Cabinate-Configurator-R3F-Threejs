"use client"

import { useEffect, useRef } from "react"
import type { Module, TransformMode } from "@/types/tray-types"

interface BlenderControlsProps {
  selectedModule: Module | null
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void
  onDeleteModule: (moduleId: string) => void
  onDuplicateModule: (moduleId: string) => void
  transformMode: TransformMode
  onTransformModeChange: (mode: TransformMode) => void
}

export function BlenderControls({
  selectedModule,
  onUpdateModule,
  onDeleteModule,
  onDuplicateModule,
  transformMode,
  onTransformModeChange,
}: BlenderControlsProps) {
  const isTransforming = useRef(false)
  const startValues = useRef<any>(null)
  const constrainAxis = useRef<"x" | "y" | "z" | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedModule) return

      // Prevent default browser shortcuts
      if (["g", "r", "s", "x", "y", "z", "Delete", "d"].includes(event.key.toLowerCase())) {
        event.preventDefault()
      }

      switch (event.key.toLowerCase()) {
        case "g":
          onTransformModeChange("translate")
          startTransform()
          break
        case "r":
          onTransformModeChange("rotate")
          startTransform()
          break
        case "s":
          onTransformModeChange("scale")
          startTransform()
          break
        case "x":
          constrainAxis.current = "x"
          break
        case "y":
          constrainAxis.current = "y"
          break
        case "z":
          constrainAxis.current = "z"
          break
        case "delete":
          onDeleteModule(selectedModule.id)
          break
        case "d":
          if (event.shiftKey) {
            onDuplicateModule(selectedModule.id)
          }
          break
        case "escape":
          cancelTransform()
          break
        case "enter":
          confirmTransform()
          break
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!isTransforming.current || !selectedModule || !startValues.current) return

      const deltaX = event.movementX
      const deltaY = event.movementY

      const sensitivity = {
        translate: 0.5,
        rotate: 1,
        scale: 0.01,
      }

      const factor = sensitivity[transformMode]

      switch (transformMode) {
        case "translate":
          updatePosition(deltaX * factor, deltaY * factor)
          break
        case "rotate":
          updateRotation(deltaX * factor, deltaY * factor)
          break
        case "scale":
          updateScale(deltaX * factor)
          break
      }
    }

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0 && isTransforming.current) {
        // Left click confirms transform
        confirmTransform()
      } else if (event.button === 2) {
        // Right click cancels transform
        cancelTransform()
      }
    }

    const startTransform = () => {
      if (!selectedModule) return
      isTransforming.current = true
      startValues.current = {
        position: { ...selectedModule.position },
        rotation: { ...selectedModule.rotation },
        scale: { ...selectedModule.scale },
      }
      document.body.style.cursor = "move"
    }

    const updatePosition = (deltaX: number, deltaY: number) => {
      if (!selectedModule || !startValues.current) return

      const newPosition = { ...selectedModule.position }

      if (constrainAxis.current === "x") {
        newPosition.x = startValues.current.position.x + deltaX
      } else if (constrainAxis.current === "z") {
        newPosition.z = startValues.current.position.z + deltaY
      } else {
        newPosition.x = startValues.current.position.x + deltaX
        newPosition.z = startValues.current.position.z + deltaY
      }

      onUpdateModule(selectedModule.id, { position: newPosition })
    }

    const updateRotation = (deltaX: number, deltaY: number) => {
      if (!selectedModule || !startValues.current) return

      const newRotation = { ...selectedModule.rotation }

      if (constrainAxis.current === "x") {
        newRotation.x = startValues.current.rotation.x + deltaY
      } else if (constrainAxis.current === "y") {
        newRotation.y = startValues.current.rotation.y + deltaX
      } else if (constrainAxis.current === "z") {
        newRotation.z = startValues.current.rotation.z + deltaX
      } else {
        newRotation.y = startValues.current.rotation.y + deltaX
      }

      onUpdateModule(selectedModule.id, { rotation: newRotation })
    }

    const updateScale = (delta: number) => {
      if (!selectedModule || !startValues.current) return

      const scaleFactor = 1 + delta
      let newScale = { ...selectedModule.scale }

      if (constrainAxis.current === "x") {
        newScale.x = Math.max(0.1, startValues.current.scale.x * scaleFactor)
      } else if (constrainAxis.current === "y") {
        newScale.y = Math.max(0.1, startValues.current.scale.y * scaleFactor)
      } else if (constrainAxis.current === "z") {
        newScale.z = Math.max(0.1, startValues.current.scale.z * scaleFactor)
      } else {
        // Uniform scaling
        const uniformScale = Math.max(0.1, startValues.current.scale.x * scaleFactor)
        newScale = { x: uniformScale, y: uniformScale, z: uniformScale }
      }

      onUpdateModule(selectedModule.id, { scale: newScale })
    }

    const confirmTransform = () => {
      isTransforming.current = false
      startValues.current = null
      constrainAxis.current = null
      document.body.style.cursor = "default"
    }

    const cancelTransform = () => {
      if (selectedModule && startValues.current) {
        onUpdateModule(selectedModule.id, {
          position: startValues.current.position,
          rotation: startValues.current.rotation,
          scale: startValues.current.scale,
        })
      }
      confirmTransform()
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      document.body.style.cursor = "default"
    }
  }, [selectedModule, transformMode, onUpdateModule, onDeleteModule, onDuplicateModule, onTransformModeChange])

  return null // This component only handles events
}
