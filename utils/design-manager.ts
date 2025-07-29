import type { TrayConfig, SavedDesign, DesignHistory } from "@/types/tray-types"

export class DesignManager {
  private static instance: DesignManager
  private designs: Map<string, DesignHistory> = new Map()

  static getInstance(): DesignManager {
    if (!DesignManager.instance) {
      DesignManager.instance = new DesignManager()
    }
    return DesignManager.instance
  }

  generateDesignCode(): string {
    const existingCodes = Array.from(this.designs.keys())
    let code = 1
    let codeStr = code.toString().padStart(3, "0")

    while (existingCodes.includes(codeStr)) {
      code++
      codeStr = code.toString().padStart(3, "0")
    }

    return codeStr
  }

  async saveDesign(config: TrayConfig, designCode?: string, name?: string): Promise<SavedDesign> {
    const code = designCode || this.generateDesignCode()
    const history = this.designs.get(code) || { designCode: code, versions: [], latestVersion: 0 }

    const newVersion = history.latestVersion + 1
    const design: SavedDesign = {
      id: `${code}-v${newVersion}`,
      designCode: code,
      version: newVersion,
      name: name || `Design ${code} v${newVersion}`,
      config: { ...config },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In production, this would save to MongoDB
    try {
      const response = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(design),
      })

      if (!response.ok) throw new Error("Failed to save design")

      const savedDesign = await response.json()

      history.versions.push(savedDesign.design)
      history.latestVersion = newVersion
      this.designs.set(code, history)

      return savedDesign.design
    } catch (error) {
      // Fallback to localStorage
      history.versions.push(design)
      history.latestVersion = newVersion
      this.designs.set(code, history)

      localStorage.setItem("tray-designs", JSON.stringify(Array.from(this.designs.entries())))
      return design
    }
  }

  async loadDesign(designCode: string, version?: number): Promise<SavedDesign | null> {
    try {
      const response = await fetch(`/api/designs/${designCode}${version ? `?version=${version}` : ""}`)
      if (!response.ok) throw new Error("Design not found")

      const data = await response.json()
      return data.design
    } catch (error) {
      // Fallback to localStorage
      const history = this.designs.get(designCode)
      if (!history) return null

      const targetVersion = version || history.latestVersion
      return history.versions.find((v) => v.version === targetVersion) || null
    }
  }

  async getAllDesigns(): Promise<DesignHistory[]> {
    try {
      const response = await fetch("/api/designs")
      if (!response.ok) throw new Error("Failed to load designs")

      const data = await response.json()
      return data.designs
    } catch (error) {
      // Fallback to localStorage
      const stored = localStorage.getItem("tray-designs")
      if (stored) {
        const entries = JSON.parse(stored)
        this.designs = new Map(entries)
      }
      return Array.from(this.designs.values())
    }
  }

  async deleteDesign(designCode: string, version?: number): Promise<boolean> {
    try {
      const url = `/api/designs/${designCode}${version ? `?version=${version}` : ""}`
      const response = await fetch(url, { method: "DELETE" })
      return response.ok
    } catch (error) {
      return false
    }
  }

  calculateThickness(width: number): { base: number; dividers: number } {
    return {
      base: width >= 600 ? 5 : 3,
      dividers: 5,
    }
  }
}
