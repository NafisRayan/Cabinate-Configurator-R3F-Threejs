"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Download, Trash2, FileText, Calendar, Search } from "lucide-react"
import type { DesignHistory, SavedDesign } from "@/types/tray-types"
import { DesignManager } from "@/utils/design-manager"

interface DesignOverviewProps {
  onLoadDesign: (design: SavedDesign) => void
  onRequestQuote: (designs: SavedDesign[]) => void
}

export function DesignOverview({ onLoadDesign, onRequestQuote }: DesignOverviewProps) {
  const [designs, setDesigns] = useState<DesignHistory[]>([])
  const [selectedDesigns, setSelectedDesigns] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterByQuoted, setFilterByQuoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const designManager = DesignManager.getInstance()

  useEffect(() => {
    loadDesigns()
  }, [])

  const loadDesigns = async () => {
    setIsLoading(true)
    try {
      const allDesigns = await designManager.getAllDesigns()
      setDesigns(allDesigns)
    } catch (error) {
      console.error("Failed to load designs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDesigns = designs.filter((history) => {
    const latestDesign = history.versions[history.versions.length - 1]
    const matchesSearch =
      latestDesign.name.toLowerCase().includes(searchTerm.toLowerCase()) || history.designCode.includes(searchTerm)
    const matchesFilter = !filterByQuoted || latestDesign.isQuoteRequested
    return matchesSearch && matchesFilter
  })

  const toggleDesignSelection = (designId: string) => {
    const newSelection = new Set(selectedDesigns)
    if (newSelection.has(designId)) {
      newSelection.delete(designId)
    } else {
      newSelection.add(designId)
    }
    setSelectedDesigns(newSelection)
  }

  const handleRequestQuote = () => {
    const selectedDesignObjects = designs
      .flatMap((history) => history.versions)
      .filter((design) => selectedDesigns.has(design.id))

    onRequestQuote(selectedDesignObjects)
  }

  const handleDeleteDesign = async (designCode: string) => {
    if (confirm(`Are you sure you want to delete design ${designCode} and all its versions?`)) {
      await designManager.deleteDesign(designCode)
      loadDesigns()
    }
  }

  if (isLoading) {
    return (
      <Card className="m-4">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading designs...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Design Overview</span>
            <Badge variant="secondary">{designs.length} designs</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="filter-quoted" checked={filterByQuoted} onCheckedChange={setFilterByQuoted} />
              <label htmlFor="filter-quoted" className="text-sm">
                Quote Requested
              </label>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedDesigns.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">
                {selectedDesigns.size} design{selectedDesigns.size > 1 ? "s" : ""} selected
              </span>
              <Button size="sm" onClick={handleRequestQuote}>
                <FileText className="w-4 h-4 mr-1" />
                Request Quote
              </Button>
            </div>
          )}

          {/* Design List */}
          <div className="space-y-3">
            {filteredDesigns.map((history) => {
              const latestDesign = history.versions[history.versions.length - 1]
              const isSelected = selectedDesigns.has(latestDesign.id)

              return (
                <Card key={history.designCode} className={`transition-all ${isSelected ? "ring-2 ring-blue-500" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleDesignSelection(latestDesign.id)} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">#{history.designCode}</h3>
                            <Badge variant="outline">v{latestDesign.version}</Badge>
                            {latestDesign.isQuoteRequested && <Badge variant="secondary">Quote Requested</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{latestDesign.name}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(latestDesign.updatedAt).toLocaleDateString()}
                            </span>
                            <span>
                              {latestDesign.config.dimensions.width}×{latestDesign.config.dimensions.depth}×
                              {latestDesign.config.dimensions.height}mm
                            </span>
                            <span>
                              {history.versions.length} version{history.versions.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => onLoadDesign(latestDesign)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            /* TODO: Implement export */
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteDesign(history.designCode)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Version History */}
                    {history.versions.length > 1 && (
                      <div className="mt-3 pt-3 border-t">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                            View all {history.versions.length} versions
                          </summary>
                          <div className="mt-2 space-y-1">
                            {history.versions
                              .slice()
                              .reverse()
                              .map((version) => (
                                <div key={version.id} className="flex items-center justify-between py-1">
                                  <span>
                                    v{version.version} - {new Date(version.createdAt).toLocaleDateString()}
                                  </span>
                                  <Button size="sm" variant="ghost" onClick={() => onLoadDesign(version)}>
                                    Load
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredDesigns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm || filterByQuoted ? "No designs match your filters" : "No designs found"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
