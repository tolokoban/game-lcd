import Data from "@/data/data"
import Polygon from "@/app/painter/polygon"
import { loadPolygonItems } from "@/data/storage"

export function generateCode(
    data: Data,
    dimension: { width: number; height: number }
): string {
    const className = "PolygonsData"
    const items = data.getPolygonList()
    const triangles = getTriangles(data)
    return linearize([
        `export default class ${className} {`,
        [
            ...generateCodeStatisIds(data),
            "",
            "private readonly drawBuff: WebGLBuffer",
            "private readonly elemBuff: WebGLBuffer",
            `private readonly offsets = [${getOffsets(triangles)}]`,
            `private readonly sizes = ${JSON.stringify(
                triangles.map((tri) => tri.length)
            )}`,
            "",
            "constructor(private readonly gl: WebGL2RenderingContext) {",
            [
                "this.elemBuff = this.createElemBuffer([",
                triangles.map(
                    (section, index) =>
                        `${section.join(", ")},  // ${items[index].name}`
                ),
                "])",
                "this.drawBuff = this.createDrawBuffer([",
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
                "])",
            ],
            "}",
            "",
            "bindBuffers() {",
            [
                "const { gl } = this",
                "gl.bindBuffer( gl.ARRAY_BUFFER, this.drawBuff )",
                "gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.elemBuff )",
            ],
            "}",
            "",
            "draw(index: number) {",
            [
                "const { gl } = this",
                "const offset = this.offsets[index]",
                "const size = this.sizes[index]",
                "gl.drawElements( gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset )",
            ],
            "}",
            "",
            "private createDrawBuffer(data: number[]): WebGLBuffer {",
            [
                "const { gl } = this",
                "const buff = gl.createBuffer()",
                `if (!buff) throw Error("Unable to create a WebGLBuffer!")`,
                "",
                "gl.bindBuffer( gl.ARRAY_BUFFER, buff )",
                "gl.bufferData(",
                [
                    "gl.ARRAY_BUFFER,",
                    "new Float32Array(data),",
                    "gl.STATIC_DRAW",
                ],
                ")",
                "return buff",
            ],
            "}",
            "",
            "private createElemBuffer(data: number[]): WebGLBuffer {",
            [
                "const { gl } = this",
                "const buff = gl.createBuffer()",
                `if (!buff) throw Error("Unable to create a WebGLBuffer!")`,
                "",
                "gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buff )",
                "gl.bufferData(",
                [
                    "gl.ELEMENT_ARRAY_BUFFER,",
                    "new Uint16Array(data),",
                    "gl.STATIC_DRAW",
                ],
                ")",
                "return buff",
            ],
            "}",
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
        return value
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
