import { type NextRequest, NextResponse } from "next/server"

// Mock database - replace with actual MongoDB integration
const designsDB = new Map()

export async function GET(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const version = searchParams.get("version")

    const history = designsDB.get(params.code)
    if (!history) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 })
    }

    const design = version
      ? history.versions.find((v: any) => v.version === Number.parseInt(version))
      : history.versions[history.versions.length - 1]

    if (!design) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 })
    }

    return NextResponse.json({ design })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch design" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { code: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const version = searchParams.get("version")

    if (version) {
      // Delete specific version
      const history = designsDB.get(params.code)
      if (history) {
        history.versions = history.versions.filter((v: any) => v.version !== Number.parseInt(version))
        if (history.versions.length === 0) {
          designsDB.delete(params.code)
        }
      }
    } else {
      // Delete entire design
      designsDB.delete(params.code)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete design" }, { status: 500 })
  }
}
