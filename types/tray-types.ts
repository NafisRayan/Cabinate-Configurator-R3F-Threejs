export interface TrayConfig {
  dimensions: {
    width: number
    depth: number
    height: number
  }
  dividers: {
    horizontal: number[]
    vertical: number[]
  }
  modules: Module[]
  materials: {
    base: string
    dividers: string
    modules: string
    bottom: "flannel" | "eco-leather"
  }
  colors: {
    base: string
    dividers: string
    modules: string
  }
  thickness: {
    base: number
    dividers: number
  }
  hasTopCover: boolean
}

export interface Module {
  id: string
  type:
    | "ring-tray-grooved"
    | "ring-tray-slots"
    | "watch-pillow"
    | "watch-pad-flat"
    | "glasses-insert"
    | "earring-flap"
    | "necklace-hooks"
    | "bracelet-bar"
    | "small-compartment"
    | "deep-compartment"
    | "cover-flap"
    | "removable-tray"
    | "custom-upload"
  cell: {
    row: number
    col: number
  }
  dimensions: {
    width: number
    depth: number
    height: number
  }
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    x: number
    y: number
    z: number
  }
  scale: {
    x: number
    y: number
    z: number
  }
  properties?: {
    slots?: number
    orientation?: "horizontal" | "vertical"
    isRemovable?: boolean
    hasLid?: boolean
    depth?: "shallow" | "medium" | "deep"
    customModelUrl?: string
    customModelName?: string
  }
  isSelected?: boolean
  isHovered?: boolean
}

export interface SavedDesign {
  id: string
  designCode: string
  version: number
  name: string
  config: TrayConfig
  createdAt: string
  updatedAt: string
  userId?: string
  thumbnailUrl?: string
  topViewUrl?: string
  sideViewUrl?: string
  isQuoteRequested?: boolean
}

export interface DesignHistory {
  designCode: string
  versions: SavedDesign[]
  latestVersion: number
}

export type Material =
  | "leather-tan"
  | "leather-black"
  | "leather-brown"
  | "leather-burgundy"
  | "velvet-black"
  | "velvet-navy"
  | "velvet-emerald"
  | "velvet-burgundy"
  | "suede-gray"
  | "fabric-cream"

export type ViewMode = "perspective" | "top" | "side"

export type TransformMode = "translate" | "rotate" | "scale"

export interface ColorOption {
  id: string
  name: string
  hex: string
  material: Material
}
