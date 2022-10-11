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
    static FALL_TOP_LEFT = 24
    static FALL_TOP_RIGHT = 25
    static FALL_BOTTOM_RIGHT = 26
    static FALL_BOTTOM_LEFT = 27

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
        0, 12, 24, 48, 78, 90, 102, 114, 126, 138, 150, 162, 174, 186, 198, 210,
        222, 234, 246, 258, 270, 282, 294, 306, 318, 342, 366, 390,
    ]
    private readonly sizes = [
        6, 6, 12, 15, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 12, 12, 12, 15,
    ]
    private readonly sprites = new Uint8Array(28)

    constructor(
        private readonly gl: WebGL2RenderingContext,
        background: HTMLImageElement,
        foreground: HTMLImageElement
    ) {
        const ratio = ensureSameAspectRatio(background, foreground)
        const x = ratio > 1 ? 1 : 1 / ratio
        const y = ratio > 1 ? ratio : 1
        // prettier-ignore
        this.backBuff = this.createDrawBuffer([
            -1, +1,
            -1, -1,
            +1, -1,
            +1, +1
        ])
        // prettier-ignore
        this.elemBuff = this.createElemBuffer([
            3, 0, 1, 1, 2, 3,  // RICK_TOP_LEFT
            7, 4, 5, 5, 6, 7,  // RICK_TOP_RIGHT
            13, 8, 9, 13, 9, 10, 13, 10, 11, 11, 12, 13,  // RICK_BOTTOM_RIGHT
            20, 14, 15, 20, 15, 16, 20, 16, 17, 20, 17, 18, 18, 19, 20,  // RICK_BOTTOM_LEFT
            24, 21, 22, 22, 23, 24,  // MORTY_TOP_0
            28, 25, 26, 26, 27, 28,  // MORTY_TOP_1
            32, 29, 30, 30, 31, 32,  // MORTY_TOP_2
            36, 33, 34, 34, 35, 36,  // MORTY_TOP_3
            40, 37, 38, 38, 39, 40,  // MORTY_TOP_4
            44, 41, 42, 42, 43, 44,  // MORTY_TOP_5
            48, 45, 46, 46, 47, 48,  // MORTY_TOP_6
            52, 49, 50, 50, 51, 52,  // MORTY_TOP_7
            56, 53, 54, 54, 55, 56,  // MORTY_TOP_8
            60, 57, 58, 58, 59, 60,  // MORTY_TOP_9
            64, 61, 62, 62, 63, 64,  // MORTY_BOTTOM_0
            68, 65, 66, 66, 67, 68,  // MORTY_BOTTOM_1
            72, 69, 70, 70, 71, 72,  // MORTY_BOTTOM_2
            76, 73, 74, 74, 75, 76,  // MORTY_BOTTOM_3
            80, 77, 78, 78, 79, 80,  // MORTY_BOTTOM_4
            84, 81, 82, 82, 83, 84,  // MORTY_BOTTOM_5
            88, 85, 86, 86, 87, 88,  // MORTY_BOTTOM_6
            92, 89, 90, 90, 91, 92,  // MORTY_BOTTOM_7
            96, 93, 94, 94, 95, 96,  // MORTY_BOTTOM_8
            100, 97, 98, 98, 99, 100,  // MORTY_BOTTOM_9
            106, 101, 102, 106, 102, 103, 106, 103, 104, 104, 105, 106,  // FALL_TOP_LEFT
            112, 107, 108, 112, 108, 109, 112, 109, 110, 110, 111, 112,  // FALL_TOP_RIGHT
            118, 113, 114, 114, 115, 116, 118, 114, 116, 116, 117, 118,  // FALL_BOTTOM_RIGHT
            119, 120, 121, 119, 121, 122, 125, 119, 122, 125, 122, 123, 123, 124, 125,  // FALL_BOTTOM_LEFT
        ])
        // prettier-ignore
        this.drawBuff = this.createDrawBuffer([
            0.49778,0.34369, 0.49845,0.54037, 0.38544,0.48654, 0.28320,0.34161,  // RICK_TOP_LEFT
            0.71976,0.33954, 0.58590,0.50414, 0.49912,0.54762, 0.49778,0.34161,  // RICK_TOP_RIGHT
            0.73792,0.74845, 0.70967,0.82298, 0.66998,0.82919, 0.62155,0.89130, 0.51863,0.91408, 0.51661,0.74948,  // RICK_BOTTOM_RIGHT
            0.27916,0.75052, 0.31414,0.81056, 0.32019,0.85921, 0.35786,0.86853, 0.40629,0.91304, 0.47962,0.91097, 0.47693,0.74845,  // RICK_BOTTOM_LEFT
            0.01076,0.18634, 0.01076,0.33747, 0.11435,0.33644, 0.11368,0.18116,  // MORTY_TOP_0
            0.20786,0.17702, 0.20517,0.33747, 0.11435,0.33644, 0.11368,0.18116,  // MORTY_TOP_1
            0.30876,0.17495, 0.30741,0.33437, 0.20584,0.33540, 0.20718,0.17598,  // MORTY_TOP_2
            0.40024,0.17598, 0.39957,0.33954, 0.30539,0.33954, 0.30674,0.17598,  // MORTY_TOP_3
            0.50114,0.18012, 0.49912,0.33954, 0.39755,0.34369, 0.39890,0.18012,  // MORTY_TOP_4
            0.60137,0.17805, 0.59935,0.33747, 0.49778,0.34161, 0.49912,0.17805,  // MORTY_TOP_5
            0.70227,0.17909, 0.70025,0.33851, 0.59868,0.34265, 0.60003,0.17909,  // MORTY_TOP_6
            0.79577,0.18116, 0.79376,0.34058, 0.69218,0.34472, 0.69353,0.18116,  // MORTY_TOP_7
            0.89802,0.17909, 0.89600,0.33851, 0.79443,0.34265, 0.79577,0.17909,  // MORTY_TOP_8
            0.99018,0.18012, 0.98816,0.33954, 0.90071,0.33851, 0.90004,0.17805,  // MORTY_TOP_9
            0.99085,0.58592, 0.98883,0.74534, 0.89466,0.74224, 0.89197,0.58075,  // MORTY_BOTTOM_0
            0.89264,0.58696, 0.89062,0.74638, 0.79645,0.74327, 0.79376,0.58178,  // MORTY_BOTTOM_1
            0.79510,0.58903, 0.79308,0.74845, 0.69891,0.74534, 0.69622,0.58385,  // MORTY_BOTTOM_2
            0.69554,0.59110, 0.69353,0.75052, 0.59935,0.74741, 0.59666,0.58592,  // MORTY_BOTTOM_3
            0.59935,0.58903, 0.59733,0.74845, 0.50316,0.74534, 0.50047,0.58385,  // MORTY_BOTTOM_4
            0.49912,0.58696, 0.49711,0.74638, 0.40293,0.74327, 0.40024,0.58178,  // MORTY_BOTTOM_5
            0.39890,0.58592, 0.39688,0.74534, 0.30270,0.74224, 0.30001,0.58075,  // MORTY_BOTTOM_6
            0.29867,0.58903, 0.29665,0.74845, 0.20247,0.74534, 0.19978,0.58385,  // MORTY_BOTTOM_7
            0.20382,0.58489, 0.20180,0.74431, 0.10763,0.74120, 0.10494,0.57971,  // MORTY_BOTTOM_8
            0.10696,0.58489, 0.10494,0.74431, 0.01076,0.74120, 0.00807,0.57971,  // MORTY_BOTTOM_9
            0.45607,0.53106, 0.45809,0.57453, 0.16077,0.57350, 0.23207,0.36542, 0.34575,0.41822, 0.36257,0.47101,  // FALL_TOP_LEFT
            0.84353,0.53209, 0.84353,0.57143, 0.54621,0.57039, 0.68142,0.37785, 0.81326,0.39441, 0.82066,0.51139,  // FALL_TOP_RIGHT
            0.81394,0.98344, 0.51661,0.98240, 0.51527,0.92236, 0.62895,0.88716, 0.66998,0.82816, 0.78232,0.79089,  // FALL_BOTTOM_RIGHT
            0.32692,0.87060, 0.39351,0.88199, 0.45607,0.97516, 0.15875,0.97412, 0.18499,0.88509, 0.19709,0.78054, 0.30674,0.78261,  // FALL_BOTTOM_LEFT
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

    on(...spriteIndexes: number[]) {
        for (const index of spriteIndexes) {
            this.sprites[index] = 1
        }
    }

    off(...spriteIndexes: number[]) {
        for (const index of spriteIndexes) {
            this.sprites[index] = 0
        }
    }

    onAll() {
        for (let index = 0; index < this.sprites.length; index++) {
            this.sprites[index] = 1
        }
    }

    offAll() {
        for (let index = 0; index < this.sprites.length; index++) {
            this.sprites[index] = 0
        }
    }

    draw() {
        const { gl, prg, vaoBackground, vaoForeground } = this
        const w = gl.canvas.clientWidth
        const h = gl.canvas.clientHeight
        const { canvas } = gl
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w
            canvas.height = h
        }
        gl.viewport(0, 0, w, h)
        gl.clearColor(0.733, 0.71, 0.655, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.disable(gl.DEPTH_TEST)
        gl.disable(gl.BLEND)
        gl.useProgram(prg)
        gl.uniform2f(this.uniAspectRatioContain, h / w, 1)
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
        gl.uniform2f(this.uniAspectRatioContain, h / w, 1)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, this.texForeground)
        gl.uniform1i(this.uniTexture, 0)
        gl.bindVertexArray(vaoForeground)
        for (let index = 0; index < this.sprites.length; index++) {
            if (this.sprites[index] === 0) continue

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
    if (Math.abs(ratio1 - ratio2) > 1e-6) {
        throw Error("Background and foregroung must have the same aspect ratio!")
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