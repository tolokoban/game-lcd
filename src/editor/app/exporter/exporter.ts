import Data from "@/editor/data/data"
import FRAG from "./shader.frag"
import Polygon from "@/editor/app/painter/polygon"
import VERT from "./shader.vert"
import { loadPolygonItems } from "@/editor/data/storage"

export function generateCode(
    data: Data,
    dimension: { width: number; height: number }
): string {
    const className = "BasePainter"
    const items = data.getPolygonList()
    const triangles = getTriangles(data)
    return linearize([
        `export default class ${className} {`,
        [
            ...generateCodeStatisIds(data),
            "",
            `protected static readonly offsets = [${getOffsets(triangles)}]`,
            `protected static readonly sizes = ${JSON.stringify(
                triangles.map((tri) => tri.length)
            )}`,
            "// prettier-ignore",
            "protected static  readonly elemArray = [",
            triangles.map(
                (section, index) =>
                    `${section.join(", ")},  // ${items[index].name}`
            ),
            "]",
            "",
            "// prettier-ignore",
            "protected static  readonly drawArray = [",
            items.map(
                (item, index) =>
                    `${item.points
                        .map(
                            ({ x, y }) =>
                                `${(x / dimension.width).toFixed(5)},${(
                                    y / dimension.height
                                ).toFixed(5)}`
                        )
                        .join(", ")},  // ${items[index].name}`
            ),
            "]",
        ],
        "}",
    ])
}

type Code = Array<string | Code>

function linearize(code: Code, indent = ""): string {
    return code
        .map((item) => {
            if (typeof item === "string") return `${indent}${item}`
            return linearize(item, `${indent}    `)
        })
        .join("\n")
}

function generateCodeStatisIds(data: Data) {
    return data
        .getPolygonList()
        .map((item, index) => `static ${item.name.toUpperCase()} = ${index}`)
}

function getOffsets(triangles: number[][]) {
    let offset = 0
    return triangles.map((section) => {
        const value = offset
        offset += section.length
        return value * Uint16Array.BYTES_PER_ELEMENT
    })
}

function getTriangles(data: Data): number[][] {
    const elements: number[][] = []
    let offset = 0
    for (const item of data.getPolygonList()) {
        const section: number[] = []
        const poly = new Polygon(item.points)
        const triangles = poly.triangulate()
        for (const [a, b, c] of triangles) {
            section.push(offset + a, offset + b, offset + c)
        }
        elements.push(section)
        offset += item.points.length
    }
    return elements
}
