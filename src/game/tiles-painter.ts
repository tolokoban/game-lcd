export default class TilesPainter {
    private readonly prg: WebGLProgram
    private readonly texBackground: WebGLTexture
    private readonly backgroundBuff: WebGLBuffer
    private readonly uniAspectRatioContain: WebGLUniformLocation
    private readonly uniTexture: WebGLUniformLocation
    private readonly vaoBackground: WebGLVertexArrayObject

    constructor(
        private readonly gl: WebGL2RenderingContext,
        background: HTMLImageElement
    ) {
        // prettier-ignore
        this.backgroundBuff = this.createDrawBuffer([
            -1, +1,
            -1, -1,
            +1, -1,
            +1, +1
        ])
        this.texBackground = this.createTexture(background)
        this.prg = createProgram(gl)
        this.vaoBackground = this.createBackgroundVAO()
        this.uniTexture = this.getUniformLocation("uniTexture")
        this.uniAspectRatioContain = this.getUniformLocation(
            "uniAspectRatioContain"
        )
    }

    draw() {
        const { gl, prg, vaoBackground } = this
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
        let scale = 2
        const ratio = w / h
        if (w > h) {
            if (ratio > 1) ratioY = 1 / ratio
            else ratioX = ratio
        } else {
            if (ratio > 1) ratioY = 1 / ratio
            else ratioX = ratio
        }
        ratioX *= scale
        ratioY *= scale
        gl.disable(gl.DEPTH_TEST)
        gl.useProgram(prg)
        gl.disable(gl.BLEND)
        gl.uniform2f(this.uniAspectRatioContain, ratioX, ratioY)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texBackground)
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

    private createTexture(img: HTMLImageElement): WebGLTexture {
        const { gl } = this
        const tex = gl.createTexture()
        if (!tex) throw Error("Enable to create a WebGLTexture!")

        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        return tex
    }
    private createBackgroundVAO() {
        const { gl, prg } = this
        const vao = gl.createVertexArray()
        if (!vao) throw Error("Unable to create a WebGLVertexArrayObject!")

        gl.bindVertexArray(vao)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.backgroundBuff)
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
    varUV = (attUV + vec2(1.0, 1.0)) * uniAspectRatioContain;
    gl_Position = vec4(attUV, 1.0, 1.0);
}`
const FRAG = `#version 300 es

precision mediump float;

uniform sampler2D uniTexture;
in vec2 varUV;
out vec4 FragColor;

void main() {
    FragColor = texture( uniTexture, varUV );
}`
