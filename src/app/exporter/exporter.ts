import Data from "@/data/data"
import FRAG from "./shader.frag"
import Polygon from "@/app/painter/polygon"
import VERT from "./shader.vert"
import { loadPolygonItems } from "@/data/storage"

export function generateCode(
    data: Data,
    dimension: { width: number; height: number }
): string {
    const className = "Painter"
    const items = data.getPolygonList()
    const triangles = getTriangles(data)
    return linearize([
        "// prettier-ignore",
        `export default class ${className} {`,
        [
            ...generateCodeStatisIds(data),
            "",
            "private readonly prg: WebGLProgram",
            "private readonly texBackground: WebGLTexture",
            "private readonly texForeground: WebGLTexture",
            "private readonly backBuff: WebGLBuffer",
            "private readonly drawBuff: WebGLBuffer",
            "private readonly elemBuff: WebGLBuffer",
            `private readonly offsets = [${getOffsets(triangles)}]`,
            `private readonly sizes = ${JSON.stringify(
                triangles.map((tri) => tri.length)
            )}`,
            `private readonly sprites = new Uint8Array(${items.length})`,
            "",
            "constructor(",
            [
                "private readonly gl: WebGL2RenderingContext,",
                "background: HTMLImageElement,",
                "foreground: HTMLImageElement",
            ],
            ") {",
            [
                "const ratio = ensureSameAspectRatio(background, foreground)",
                "const x = ratio > 1 ? 1 : 1 / ratio",
                "const y = ratio > 1 ? ratio : 1",
                "this.backBuff = this.createDrawBuffer([",
                [
                    "-x, +y, -1, +1,",
                    "-x, -y, -1, -1,",
                    "+x, -y, +1, -1,",
                    "+x, +y, +1, +1",
                ],
                "])",
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
                "this.texBackground = this.createTexture(background)",
                "this.texForeground = this.createTexture(foreground)",
                "this.prg = createProgram(gl)",
            ],
            "}",
            "",
            "on(...spriteIndexes: number[]) {",
            [
                "for (const index of spriteIndexes) {",
                ["this.sprites[index] = 1"],
                "}",
            ],
            "}",
            "",
            "off(...spriteIndexes: number[]) {",
            [
                "for (const index of spriteIndexes) {",
                ["this.sprites[index] = 0"],
                "}",
            ],
            "}",
            "",
            "onAll() {",
            [
                "for (let index = 0; index < this.sprites.length; index++) {",
                ["this.sprites[index] = 1"],
                "}",
            ],
            "}",
            "",
            "offAll() {",
            [
                "for (let index = 0; index < this.sprites.length; index++) {",
                ["this.sprites[index] = 0"],
                "}",
            ],
            "}",
            "",
            "draw(index: number) {",
            [
                "const { gl, prg } = this",
                "const w = gl.drawingBufferWidth",
                "const h = gl.drawingBufferHeight",
                "const { canvas } = gl",
                "if (canvas.width !== w || canvas.height !== h) {",
                ["canvas.width = w", "canvas.height = h"],
                "}",
                "gl.viewport(0, 0, w, h)",
                "gl.bindBuffer( gl.ARRAY_BUFFER, this.drawBuff )",
                "gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.elemBuff )",
                "for (let index = 0; index < this.sprites.length; index++) {",
                [
                    "if (this.sprites[index] === 0) continue",
                    "",
                    "const offset = this.offsets[index]",
                    "const size = this.sizes[index]",
                    "gl.drawElements( gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset )",
                ],
                "}",
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
            "",
            "createTexture(img: HTMLImageElement): WebGLTexture {",
            [
                "const { gl } = this",
                "const tex = gl.createTexture()",
                `if (!tex) throw Error("Enable to create a WebGLTexture!")`,
                "",
                "gl.bindTexture(gl.TEXTURE_2D, tex)",
                "gl.texImage2D(",
                [
                    "gl.TEXTURE_2D, 0,",
                    "gl.RGBA, gl.RGBA,",
                    "gl.UNSIGNED_BYTE,",
                    "img",
                ],
                ")",
                "return tex",
            ],
            "}",
        ],
        "}",
        "",
        "interface Dimension {",
        ["width: number", "height: number"],
        "}",
        "",
        "function ensureSameAspectRatio(img1: Dimension, img2: Dimension): number {",
        [
            "const ratio1 = img1.width / img1.height",
            "const ratio2 = img2.width / img2.height",
            "if (Math.abs(ratio1 - ratio2) > 1e-6) {",
            [
                `throw Error("Background and foregroung must have the same aspect ratio!")`,
            ],
            "}",
            "return ratio1",
        ],
        "}",
        "",
        "function createProgram(gl: WebGL2RenderingContext) {",
        [
            "const prg = gl.createProgram()",
            'if (!prg) throw Error("Unable to create WebGL Program!")',
            "",
            "const vertShader = gl.createShader(gl.VERTEX_SHADER)",
            'if (!vertShader) throw Error("Unable to create a Vertex Shader handle!")',
            "",
            "gl.shaderSource(vertShader, VERT)",
            "gl.compileShader(vertShader)",
            "gl.attachShader(prg, vertShader)",
            "const fragShader = gl.createShader(gl.FRAGMENT_SHADER)",
            'if (!fragShader) throw Error("Unable to create a Fragment Shader handle!")',
            "",
            "gl.shaderSource(fragShader, FRAG)",
            "gl.compileShader(fragShader)",
            "gl.attachShader(prg, fragShader)",
            "gl.linkProgram(prg)",
            "return prg",
        ],
        "}",
        "",
        `const VERT = \`${VERT.trim()}\``,
        `const FRAG = \`${FRAG.trim()}\``,
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
