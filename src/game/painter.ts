import BasePainter from "./base-painter"
import TilesPainter from "./tiles-painter"

export default class Painter extends BasePainter {
    private readonly prg: WebGLProgram
    private readonly texBackground: WebGLTexture
    private readonly texSprites: WebGLTexture
    private readonly texForeground: WebGLTexture
    private readonly backBuff: WebGLBuffer
    private readonly drawBuff: WebGLBuffer
    private readonly elemBuff: WebGLBuffer
    private readonly uniAspectRatioContain: WebGLUniformLocation
    private readonly uniTexture: WebGLUniformLocation
    private readonly vaoBackground: WebGLVertexArrayObject
    private readonly vaoForeground: WebGLVertexArrayObject
    private ratioImage = 1
    private readonly tilePainter: TilesPainter

    constructor(
        private readonly gl: WebGL2RenderingContext,
        background: HTMLImageElement,
        sprites: HTMLImageElement,
        foreground: HTMLImageElement,
        metal: HTMLImageElement
    ) {
        super()
        this.tilePainter = new TilesPainter(gl, metal)
        this.ratioImage = ensureSameAspectRatio(background, sprites)
        // prettier-ignore
        this.backBuff = this.createDrawBuffer([
            0, 1,
            0, 0,
            1, 0,
            1, 1
        ])
        // prettier-ignore
        this.elemBuff = this.createElemBuffer(            BasePainter.elemArray)
        // prettier-ignore
        this.drawBuff = this.createDrawBuffer(BasePainter.drawArray)
        this.texBackground = this.createTexture(background)
        this.texSprites = this.createTexture(sprites)
        this.texForeground = this.createTexture(foreground)
        this.prg = createProgram(gl)
        this.vaoBackground = this.createBackgroundVAO()
        this.vaoForeground = this.createForegroundVAO()
        this.uniTexture = this.getUniformLocation("uniTexture")
        this.uniAspectRatioContain = this.getUniformLocation(
            "uniAspectRatioContain"
        )
    }

    draw(spriteIndexes: number[]) {
        const { gl, prg, vaoBackground, vaoForeground, ratioImage } = this
        const w = gl.canvas.clientWidth
        const h = gl.canvas.clientHeight
        const { canvas } = gl
        if (canvas.width !== w || canvas.height !== h) {
            const dpr = window.devicePixelRatio
            canvas.width = w * dpr
            canvas.height = h * dpr
            gl.viewport(0, 0, w * dpr, h * dpr)
        }
        let ratioX = 1
        let ratioY = 1
        let scale = 1
        const MARGIN_WIDE = 0.1
        const MARGIN_NARROW = 0.005
        const ratioScreen = w / h
        const ratio = ratioImage / ratioScreen
        if (w > h) {
            if (ratio > 1) ratioY = 1 / ratio
            else ratioX = ratio
            const w2 = w * (1 - MARGIN_WIDE)
            const h2 = h * (1 - MARGIN_NARROW)
            scale = Math.min(w2 / w, h2 / h)
        } else {
            if (ratio > 1) ratioY = 1 / ratio
            else ratioX = ratio
            const w2 = w * (1 - MARGIN_NARROW)
            const h2 = h * (1 - MARGIN_WIDE)
            scale = Math.min(w2 / w, h2 / h)
        }
        ratioX *= scale
        ratioY *= scale
        // gl.clearColor(0.25, 0.5, 0.447, 1)
        // gl.clear(gl.COLOR_BUFFER_BIT)
        this.tilePainter.draw()
        gl.disable(gl.DEPTH_TEST)
        gl.useProgram(prg)
        //------------
        // Background
        gl.disable(gl.BLEND)
        gl.uniform2f(this.uniAspectRatioContain, ratioX, ratioY)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texBackground)
        gl.uniform1i(this.uniTexture, 0)
        gl.bindVertexArray(vaoBackground)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
        gl.bindVertexArray(null)
        //---------
        // Sprites
        gl.enable(gl.BLEND)
        gl.blendEquation(gl.FUNC_ADD)
        gl.blendFuncSeparate(
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA,
            gl.ZERO,
            gl.ONE
        )
        gl.uniform2f(this.uniAspectRatioContain, ratioX, ratioY)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texSprites)
        gl.uniform1i(this.uniTexture, 0)
        gl.bindVertexArray(vaoForeground)
        for (const index of spriteIndexes) {
            const offset = BasePainter.offsets[index]
            const size = BasePainter.sizes[index]
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset)
        }
        gl.bindVertexArray(null)
        //------------
        // Foreground
        gl.uniform2f(this.uniAspectRatioContain, ratioX * 1.1, ratioY * 1.1)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texForeground)
        gl.uniform1i(this.uniTexture, 0)
        gl.bindVertexArray(vaoBackground)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
        gl.bindVertexArray(null)
    }

    private createDrawBuffer(data: number[]): WebGLBuffer {
        const { gl } = this
        const buff = gl.createBuffer()
        if (!buff) throw Error("Unable to create a WebGLBuffer!")

        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
        return buff
    }

    private createElemBuffer(data: number[]): WebGLBuffer {
        const { gl } = this
        const buff = gl.createBuffer()
        if (!buff) throw Error("Unable to create a WebGLBuffer!")

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff)
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(data),
            gl.STATIC_DRAW
        )
        return buff
    }

    private createTexture(img: HTMLImageElement): WebGLTexture {
        const { gl } = this
        const tex = gl.createTexture()
        if (!tex) throw Error("Enable to create a WebGLTexture!")

        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        return tex
    }

    private createForegroundVAO() {
        const { gl, prg } = this
        const vao = gl.createVertexArray()
        if (!vao) throw Error("Unable to create a WebGLVertexArrayObject!")

        gl.bindVertexArray(vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.drawBuff)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elemBuff)
        const attUV = gl.getAttribLocation(prg, "attUV")
        gl.enableVertexAttribArray(attUV)
        gl.vertexAttribPointer(attUV, 2, gl.FLOAT, false, 8, 0)
        gl.bindVertexArray(null)
        return vao
    }

    private createBackgroundVAO() {
        const { gl, prg } = this
        const vao = gl.createVertexArray()
        if (!vao) throw Error("Unable to create a WebGLVertexArrayObject!")

        gl.bindVertexArray(vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.backBuff)
        const attUV = gl.getAttribLocation(prg, "attUV")
        gl.enableVertexAttribArray(attUV)
        gl.vertexAttribPointer(attUV, 2, gl.FLOAT, false, 8, 0)
        gl.bindVertexArray(null)
        return vao
    }

    private getUniformLocation(name: string) {
        const { gl, prg } = this
        const loc = gl.getUniformLocation(prg, name)
        if (!loc) throw Error(`Unable to get uniform location for "${name}"!`)

        return loc
    }
}

interface Dimension {
    width: number
    height: number
}

function ensureSameAspectRatio(img1: Dimension, img2: Dimension): number {
    const ratio1 = img1.width / img1.height
    const ratio2 = img2.width / img2.height
    if (Math.abs(ratio1 - ratio2) > 1e-3) {
        throw Error(
            "Background and sprites images must have the same aspect ratio!"
        )
    }
    return ratio1
}

function createProgram(gl: WebGL2RenderingContext) {
    const prg = gl.createProgram()
    if (!prg) throw Error("Unable to create WebGL Program!")

    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    if (!vertShader) throw Error("Unable to create a Vertex Shader handle!")

    gl.shaderSource(vertShader, VERT)
    gl.compileShader(vertShader)
    gl.attachShader(prg, vertShader)
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    if (!fragShader) throw Error("Unable to create a Fragment Shader handle!")

    gl.shaderSource(fragShader, FRAG)
    gl.compileShader(fragShader)
    gl.attachShader(prg, fragShader)
    gl.linkProgram(prg)
    return prg
}

const VERT = `#version 300 es

uniform vec2 uniAspectRatioContain;
in vec2 attUV;
out vec2 varUV;

void main() {
    varUV = attUV;
    vec2 point = vec2(2.0 * attUV.x - 1.0, 1.0 - 2.0 * attUV.y);
    gl_Position = vec4(point * uniAspectRatioContain, 0.5, 1.0);
}`
const FRAG = `#version 300 es

precision mediump float;

uniform sampler2D uniTexture;
in vec2 varUV;
out vec4 FragColor;

void main() {
    FragColor = texture( uniTexture, varUV );
}`
