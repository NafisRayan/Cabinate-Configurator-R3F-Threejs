import { MeshStandardMaterial, Vector2 } from "three"

const materialCache = new Map<string, MeshStandardMaterial>()

export function getMaterial(materialType: string, color: string): MeshStandardMaterial {
  const key = `${materialType}-${color}`

  if (materialCache.has(key)) {
    return materialCache.get(key)!
  }

  let material: MeshStandardMaterial

  switch (materialType) {
    case "leather-tan":
    case "leather-black":
      material = new MeshStandardMaterial({
        color,
        roughness: 0.8,
        metalness: 0.1,
        normalScale: new Vector2(0.5, 0.5),
      })
      break

    case "velvet-black":
    case "velvet-navy":
      material = new MeshStandardMaterial({
        color,
        roughness: 1.0,
        metalness: 0.0,
        normalScale: new Vector2(0.3, 0.3),
      })
      break

    case "suede-gray":
      material = new MeshStandardMaterial({
        color,
        roughness: 0.9,
        metalness: 0.05,
        normalScale: new Vector2(0.4, 0.4),
      })
      break

    case "fabric-cream":
      material = new MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.0,
        normalScale: new Vector2(0.2, 0.2),
      })
      break

    default:
      material = new MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.1,
      })
  }

  materialCache.set(key, material)
  return material
}
