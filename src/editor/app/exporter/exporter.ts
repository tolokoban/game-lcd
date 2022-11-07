import Data from "@/editor/data/data"
import FRAG from "./shader.frag"
import Polygon from "@/editor/app/painter/polygon"
import VERT from "./shader.vert"
import { loadPolygonItems } from "@/editor/data/storage"

export function generateCode(
    data: Data,
    dimension: { width: number; height: number }
): string {
    const className = "Painter"
    const items = data.getPolygonList()
    const triangles = getTriangles(data)
    return linearize([
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
            "private readonly uniAspectRatioContain: WebGLUniformLocation",
            "private readonly uniTexture: WebGLUniformLocation",
            "private readonly vaoBackground: WebGLVertexArrayObject",
            "private readonly vaoForeground: WebGLVertexArrayObject",
            `private readonly offsets = [${getOffsets(triangles)}]`,
            `private readonly sizes = ${JSON.stringify(
                triangles.map((tri) => tri.length)
            )}`,
            "private ratioImage = 1",
            "",
            "constructor(",
            [
                "private readonly gl: WebGL2RenderingContext,",
                "background: HTMLImageElement,",
                "foreground: HTMLImageElement",
            ],
            ") {",
            [
                "this.ratioImage = ensureSameAspectRatio(background, foreground)",
                "// prettier-ignore",
                "this.backBuff = this.createDrawBuffer([",
                ["0, 1,", "0, 0,", "1, 0,", "1, 0"],
                "])",
                "// prettier-ignore",
                "this.elemBuff = this.createElemBuffer([",
                triangles.map(
                    (section, index) =>
                        `${section.join(", ")},  // ${items[index].name}`
                ),
                "])",
                "// prettier-ignore",
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
                "this.vaoBackground = this.createBackgroundVAO()",
                "this.vaoForeground = this.createForegroundVAO()",
                'this.uniTexture = this.getUniformLocation("uniTexture")',
                'this.uniAspectRatioContain = this.getUniformLocation("uniAspectRatioContain")',
            ],
            "}",
            "",
            "draw(spriteIndexes: number[]) {",
            [
                "const { gl, prg, vaoBackground, vaoForeground, ratioImage } = this",
                "const w = gl.canvas.clientWidth",
                "const h = gl.canvas.clientHeight",
                "const { canvas } = gl",
                "if (canvas.width !== w || canvas.height !== h) {",
                [
                    "const dpr = window.devicePixelRatio",
                    "canvas.width = w * dpr",
                    "canvas.height = h * dpr",
                    "gl.viewport(0, 0, w * dpr, h * dpr)",
                ],
                "}",
                "let ratioX = 1",
                "let ratioY = 1",
                "let scale = 1",
                "const MARGIN_WIDE = 0.1",
                "const MARGIN_NARROW = 0.005",
                "const ratioScreen = w / h",
                "const ratio = ratioImage / ratioScreen",
                "if (w > h) {",
                [
                    "if (ratio > 1) ratioY = 1 / ratio",
                    "else ratioX = ratio",
                    "const w2 = w * (1 - MARGIN_WIDE)",
                    "const h2 = h * (1 - MARGIN_NARROW)",
                    "scale = Math.min(w2 / w, h2 / h)",
                ],
                "} else {",
                [
                    "if (ratio > 1) ratioY = 1 / ratio",
                    "else ratioX = ratio",
                    "const w2 = w * (1 - MARGIN_NARROW)",
                    "const h2 = h * (1 - MARGIN_WIDE)",
                    "scale = Math.min(w2 / w, h2 / h)",
                ],
                "}",
                "ratioX *= scale",
                "ratioY *= scale",
                "gl.clearColor(0.733, 0.710, 0.655, 1)",
                "gl.clear(gl.COLOR_BUFFER_BIT)",
                "gl.disable(gl.DEPTH_TEST)",
                "gl.disable(gl.BLEND)",
                "gl.useProgram(prg)",
                "gl.uniform2f(this.uniAspectRatioContain, ratioX, ratioY)",
                "gl.activeTexture(gl.TEXTURE0)",
                "gl.bindTexture(gl.TEXTURE_2D, this.texBackground)",
                "gl.uniform1i(this.uniTexture, 0)",
                "gl.bindVertexArray(vaoBackground)",
                "gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)",
                "gl.bindVertexArray(null)",
                "gl.enable(gl.BLEND)",
                "gl.blendEquation(gl.FUNC_ADD)",
                "gl.blendFuncSeparate(",
                [
                    "gl.SRC_ALPHA,",
                    "gl.ONE_MINUS_SRC_ALPHA,",
                    "gl.ZERO,",
                    "gl.ONE",
                ],
                ")",
                "gl.useProgram(prg)",
                "gl.uniform2f(this.uniAspectRatioContain, ratioX, ratioY)",
                "gl.activeTexture(gl.TEXTURE0)",
                "gl.bindTexture(gl.TEXTURE_2D, this.texForeground)",
                "gl.uniform1i(this.uniTexture, 0)",
                "gl.bindVertexArray(vaoForeground)",
                "for (const index of spriteIndexes) {",
                [
                    "const offset = this.offsets[index]",
                    "const size = this.sizes[index]",
                    "gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset)",
                ],
                "}",
                "gl.bindVertexArray(null)",
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
            "private createTexture(img: HTMLImageElement): WebGLTexture {",
            [
                "const { gl } = this",
                "const tex = gl.createTexture()",
                `if (!tex) throw Error("Enable to create a WebGLTexture!")`,
                "",
                "gl.bindTexture(gl.TEXTURE_2D, tex)",
                "gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)",
                "gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)",
                "gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)",
                "gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)",
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
            "",
            "private createForegroundVAO() {",
            [
                "const { gl, prg } = this",
                "const vao = gl.createVertexArray()",
                'if (!vao) throw Error("Unable to create a WebGLVertexArrayObject!")',
                "",
                "gl.bindVertexArray(vao)",
                "gl.bindBuffer(gl.ARRAY_BUFFER, this.drawBuff)",
                "gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elemBuff)",
                'const attUV = gl.getAttribLocation(prg, "attUV")',
                "gl.enableVertexAttribArray(attUV)",
                "gl.vertexAttribPointer(attUV, 2, gl.FLOAT, false, 8, 0)",
                "gl.bindVertexArray(null)",
                "return vao",
            ],
            "}",
            "",
            "private createBackgroundVAO() {",
            [
                "const { gl, prg } = this",
                "const vao = gl.createVertexArray()",
                'if (!vao) throw Error("Unable to create a WebGLVertexArrayObject!")',
                "",
                "gl.bindVertexArray(vao)",
                "gl.bindBuffer(gl.ARRAY_BUFFER, this.backBuff)",
                'const attUV = gl.getAttribLocation(prg, "attUV")',
                "gl.enableVertexAttribArray(attUV)",
                "gl.vertexAttribPointer(attUV, 2, gl.FLOAT, false, 8, 0)",
                "gl.bindVertexArray(null)",
                "return vao",
            ],
            "}",
            "",
            "private getUniformLocation(name: string) {",
            [
                "const { gl, prg } = this",
                "const loc = gl.getUniformLocation(prg, name)",
                'if (!loc) throw Error(`Unable to get uniform location for "${name}"!`)',
                "",
                "return loc",
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
            "if (Math.abs(ratio1 - ratio2) > 1e-3) {",
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
