"use client"

import { useRef, useMemo } from "react"
import type { Group } from "three"
import type { TrayConfig, ViewMode } from "@/types/tray-types"
import { TrayBase } from "./tray-base"
import { TrayDividers } from "./tray-dividers"
import { CellHighlight } from "./cell-highlight"
import { InteractiveTrayModules } from "./interactive-tray-modules"

interface TraySceneProps {
  config: TrayConfig
  selectedCell: { row: number; col: number } | null
  onCellSelect: (cell: { row: number; col: number } | null) => void
  selectedModuleId: string | null
  onSelectModule: (moduleId: string | null) => void
  onHoverModule: (moduleId: string | null) => void
  viewMode: ViewMode
  moduleToPlace: string | null
  onPlaceModule: (moduleId: string, row: number, col: number) => void
}

export function TrayScene({
  config,
  selectedCell,
  onCellSelect,
  selectedModuleId,
  onSelectModule,
  onHoverModule,
  viewMode,
  moduleToPlace,
  onPlaceModule,
}: TraySceneProps) {
  const groupRef = useRef<Group>(null)

  // Calculate grid cells based on dividers
  const gridCells = useMemo(() => {
    const { width, depth } = config.dimensions
    const { horizontal, vertical } = config.dividers

    const rows = [0, ...horizontal, depth].sort((a, b) => a - b)
    const cols = [0, ...vertical, width].sort((a, b) => a - b)

    const cells = []
    for (let i = 0; i < rows.length - 1; i++) {
      for (let j = 0; j < cols.length - 1; j++) {
        cells.push({
          row: i,
          col: j,
          x: cols[j] - width / 2,
          z: rows[i] - depth / 2,
          width: cols[j + 1] - cols[j],
          depth: rows[i + 1] - rows[i],
        })
      }
    }

    return cells
  }, [config.dimensions, config.dividers])

  const handleCellClick = (row: number, col: number) => {
    // If we're placing a module, place it
    if (moduleToPlace) {
      onPlaceModule(moduleToPlace, row, col)
      return
    }

    // Otherwise, handle normal cell selection
    if (selectedCell?.row === row && selectedCell?.col === col) {
      onCellSelect(null)
    } else {
      onCellSelect({ row, col })
      // Deselect any selected module when selecting a cell
      onSelectModule(null)
    }
  }

  return (
    <group ref={groupRef}>
      {/* Tray Base */}
      <TrayBase config={config} />

      {/* Dividers */}
      <TrayDividers config={config} />

      {/* Interactive Modules - only show placed modules */}
      <InteractiveTrayModules
        config={{
          ...config,
          modules: config.modules.filter((m) => m.cell.row !== -1 && m.cell.col !== -1),
        }}
        gridCells={gridCells}
        selectedModuleId={selectedModuleId}
        onSelectModule={onSelectModule}
        onHoverModule={onHoverModule}
      />

      {/* Cell Highlights and Click Areas */}
      {gridCells.map((cell) => (
        <group key={`${cell.row}-${cell.col}`}>
          <CellHighlight
            cell={cell}
            isSelected={selectedCell?.row === cell.row && selectedCell?.col === cell.col}
            isPlacementTarget={!!moduleToPlace}
            onClick={() => handleCellClick(cell.row, cell.col)}
          />
        </group>
      ))}
    </group>
  )
}
