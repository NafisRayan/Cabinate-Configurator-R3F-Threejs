import { type NextRequest, NextResponse } from "next/server"
import type { SavedDesign, DesignHistory } from "@/types/tray-types"

// Mock database - replace with actual MongoDB integration
const designsDB = new Map<string, DesignHistory>()

export async function GET() {
  try {
    // In production: const designs = await db.collection('designs').find().toArray()
    const designs = Array.from(designsDB.values())
    return NextResponse.json({ designs })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch designs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const design: SavedDesign = await request.json()

    // In production: MongoDB operations
    const history = designsDB.get(design.designCode) || {
      designCode: design.designCode,
      versions: [],
      latestVersion: 0,
    }

    history.versions.push(design)
    history.latestVersion = design.version
    designsDB.set(design.designCode, history)

    // In production: await db.collection('designs').insertOne(design)
    return NextResponse.json({ design })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save design" }, { status: 500 })
  }
}
