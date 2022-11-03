export default class Painter {
    static RICK_TOP_LEFT = 0
    static RICK_TOP_RIGHT = 1
    static RICK_BOTTOM_RIGHT = 2
    static RICK_BOTTOM_LEFT = 3
    static MORTY_TOP_0 = 4
    static MORTY_TOP_1 = 5
    static MORTY_TOP_2 = 6
    static MORTY_TOP_3 = 7
    static MORTY_TOP_4 = 8
    static MORTY_TOP_5 = 9
    static MORTY_TOP_6 = 10
    static MORTY_TOP_7 = 11
    static MORTY_TOP_8 = 12
    static MORTY_TOP_9 = 13
    static MORTY_BOTTOM_0 = 14
    static MORTY_BOTTOM_1 = 15
    static MORTY_BOTTOM_2 = 16
    static MORTY_BOTTOM_3 = 17
    static MORTY_BOTTOM_4 = 18
    static MORTY_BOTTOM_5 = 19
    static MORTY_BOTTOM_6 = 20
    static MORTY_BOTTOM_7 = 21
    static MORTY_BOTTOM_8 = 22
    static MORTY_BOTTOM_9 = 23

    private readonly prg: WebGLProgram
    private readonly texBackground: WebGLTexture
    private readonly texForeground: WebGLTexture
    private readonly backBuff: WebGLBuffer
    private readonly drawBuff: WebGLBuffer
    private readonly elemBuff: WebGLBuffer
    private readonly uniAspectRatioContain: WebGLUniformLocation
    private readonly uniTexture: WebGLUniformLocation
    private readonly vaoBackground: WebGLVertexArrayObject
    private readonly vaoForeground: WebGLVertexArrayObject
    private readonly offsets = [
        0, 36, 66, 102, 138, 150, 162, 174, 186, 198, 210, 222, 234, 246, 258,
        270, 282, 294, 306, 318, 330, 342, 354, 366,
    ]
    private readonly sizes = [
        18, 15, 18, 18, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6,
    ]
    private ratioImage = 1

    constructor(
        private readonly gl: WebGL2RenderingContext,
        background: HTMLImageElement,
        foreground: HTMLImageElement
    ) {
        this.ratioImage = ensureSameAspectRatio(background, foreground)
        // prettier-ignore
        this.backBuff = this.createDrawBuffer([
            -1, +1,
            -1, -1,
            +1, -1,
            +1, +1
        ])
        // prettier-ignore
        this.elemBuff = this.createElemBuffer([
            0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 7, 0, 5, 5, 6, 7,  // RICK_TOP_LEFT
            14, 8, 9, 14, 9, 10, 14, 10, 11, 14, 11, 12, 12, 13, 14,  // RICK_TOP_RIGHT
            22, 15, 16, 22, 16, 17, 22, 17, 18, 22, 18, 19, 22, 19, 20, 20, 21, 22,  // RICK_BOTTOM_RIGHT
            30, 23, 24, 30, 24, 25, 30, 25, 26, 30, 26, 27, 30, 27, 28, 28, 29, 30,  // RICK_BOTTOM_LEFT
            34, 31, 32, 32, 33, 34,  // MORTY_TOP_0
            38, 35, 36, 36, 37, 38,  // MORTY_TOP_1
            42, 39, 40, 40, 41, 42,  // MORTY_TOP_2
            46, 43, 44, 44, 45, 46,  // MORTY_TOP_3
            50, 47, 48, 48, 49, 50,  // MORTY_TOP_4
            54, 51, 52, 52, 53, 54,  // MORTY_TOP_5
            58, 55, 56, 56, 57, 58,  // MORTY_TOP_6
            62, 59, 60, 60, 61, 62,  // MORTY_TOP_7
            66, 63, 64, 64, 65, 66,  // MORTY_TOP_8
            70, 67, 68, 68, 69, 70,  // MORTY_TOP_9
            74, 71, 72, 72, 73, 74,  // MORTY_BOTTOM_0
            78, 75, 76, 76, 77, 78,  // MORTY_BOTTOM_1
            82, 79, 80, 80, 81, 82,  // MORTY_BOTTOM_2
            86, 83, 84, 84, 85, 86,  // MORTY_BOTTOM_3
            90, 87, 88, 88, 89, 90,  // MORTY_BOTTOM_4
            94, 91, 92, 92, 93, 94,  // MORTY_BOTTOM_5
            98, 95, 96, 96, 97, 98,  // MORTY_BOTTOM_6
            102, 99, 100, 100, 101, 102,  // MORTY_BOTTOM_7
            106, 103, 104, 104, 105, 106,  // MORTY_BOTTOM_8
            110, 107, 108, 108, 109, 110,  // MORTY_BOTTOM_9
        ])
        // prettier-ignore
        this.drawBuff = this.createDrawBuffer([
            0.50082,0.34711, 0.50156,0.58489, 0.37113,0.58696, 0.37651,0.50932, 0.34558,0.45756, 0.33751,0.37992, 0.29314,0.36335, 0.29247,0.34369,  // RICK_TOP_LEFT
            0.70234,0.34279, 0.70125,0.36335, 0.65956,0.38199, 0.65889,0.43892, 0.62595,0.59524, 0.50156,0.57660, 0.49955,0.34576,  // RICK_TOP_RIGHT
            0.70730,0.74948, 0.70730,0.77226, 0.65486,0.78882, 0.65419,0.84679, 0.61990,0.89855, 0.62527,0.98344, 0.50291,0.98137, 0.50096,0.75073,  // RICK_BOTTOM_RIGHT
            0.28987,0.75155, 0.29045,0.77433, 0.34558,0.78882, 0.34491,0.84472, 0.37853,0.89648, 0.37920,0.99172, 0.50224,0.99172, 0.50089,0.75362,  // RICK_BOTTOM_LEFT
            0.00336,0.18116, 0.00383,0.33183, 0.10825,0.32919, 0.10757,0.17909,  // MORTY_TOP_0
            0.20775,0.15839, 0.20977,0.34990, 0.10959,0.34576, 0.11026,0.16563,  // MORTY_TOP_1
            0.30524,0.18737, 0.29650,0.34265, 0.21717,0.33644, 0.21985,0.19048,  // MORTY_TOP_2
            0.36979,0.34576, 0.31869,0.34679, 0.31802,0.19255, 0.37180,0.19772,  // MORTY_TOP_3
            0.50224,0.17391, 0.49686,0.34990, 0.39668,0.34576, 0.39601,0.17805,  // MORTY_TOP_4
            0.59031,0.18116, 0.59099,0.33644, 0.52711,0.33954, 0.52510,0.18841,  // MORTY_TOP_5
            0.67973,0.18530, 0.67973,0.34161, 0.61317,0.34369, 0.61519,0.18737,  // MORTY_TOP_6
            0.78344,0.18302, 0.78529,0.34369, 0.70259,0.33644, 0.70239,0.18302,  // MORTY_TOP_7
            0.90093,0.19151, 0.87807,0.33644, 0.80479,0.34058, 0.80344,0.19669,  // MORTY_TOP_8
            0.98027,0.17391, 0.99708,0.34990, 0.90360,0.34611, 0.90362,0.17909,  // MORTY_TOP_9
            0.97960,0.73913, 0.90564,0.73602, 0.90362,0.58489, 0.97220,0.58696,  // MORTY_BOTTOM_0
            0.88681,0.57246, 0.88816,0.75673, 0.78798,0.75362, 0.78596,0.56832,  // MORTY_BOTTOM_1
            0.77655,0.74845, 0.69654,0.74741, 0.69443,0.59556, 0.76714,0.59627,  // MORTY_BOTTOM_2
            0.67906,0.60352, 0.68511,0.75362, 0.62124,0.75155, 0.62259,0.60766,  // MORTY_BOTTOM_3
            0.59368,0.59213, 0.60578,0.74224, 0.50560,0.75776, 0.49417,0.57867,  // MORTY_BOTTOM_4
            0.46593,0.59213, 0.47131,0.74845, 0.40542,0.74948, 0.40266,0.58978,  // MORTY_BOTTOM_5
            0.37449,0.74948, 0.32205,0.74845, 0.32138,0.59938, 0.37382,0.60352,  // MORTY_BOTTOM_6
            0.29179,0.58592, 0.29029,0.75302, 0.20708,0.74741, 0.20708,0.58903,  // MORTY_BOTTOM_7
            0.20103,0.75052, 0.11295,0.74741, 0.10403,0.59435, 0.18825,0.59524,  // MORTY_BOTTOM_8
            0.08808,0.57557, 0.09682,0.74638, 0.00134,0.75880, 0.00538,0.58282,  // MORTY_BOTTOM_9
        ])
        this.texBackground = this.createTexture(background)
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
        const ratioScreen = w / h
        const ratio = ratioImage / ratioScreen
        let ratioX = 1
        let ratioY = 1
        if (ratio > 1) ratioY = 1 / ratio
        else ratioX = ratio
        gl.clearColor(0.733, 0.71, 0.655, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.disable(gl.DEPTH_TEST)
        gl.disable(gl.BLEND)
        gl.useProgram(prg)
        gl.uniform2f(this.uniAspectRatioContain, ratioX, ratioY)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texBackground)
        gl.uniform1i(this.uniTexture, 0)
        gl.bindVertexArray(vaoBackground)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

        gl.bindVertexArray(null)
        gl.enable(gl.BLEND)
        gl.blendEquation(gl.FUNC_ADD)
        gl.blendFuncSeparate(
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA,
            gl.ZERO,
            gl.ONE
        )
        gl.useProgram(prg)
        gl.uniform2f(this.uniAspectRatioContain, ratioX, ratioY)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texForeground)
        gl.uniform1i(this.uniTexture, 0)
        gl.bindVertexArray(vaoForeground)
        for (const index of spriteIndexes) {
            const offset = this.offsets[index]
            const size = this.sizes[index]
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset)
        }
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
            "Background and foregroung must have the same aspect ratio!"
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
