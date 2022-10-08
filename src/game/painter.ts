// prettier-ignore
export default class Painter {
    static POLYGON_1 = 0
    static POLYGON_2 = 1
    static POLYGON_3 = 2
    static POLYGON_4 = 3
    
    private readonly prg: WebGLProgram
    private readonly texBackground: WebGLTexture
    private readonly texForeground: WebGLTexture
    private readonly backBuff: WebGLBuffer
    private readonly drawBuff: WebGLBuffer
    private readonly elemBuff: WebGLBuffer
    private readonly offsets = [0,6,12,24]
    private readonly sizes = [6,6,12,15]
    private readonly sprites = new Uint8Array(4)
    
    constructor(
        private readonly gl: WebGL2RenderingContext,
        background: HTMLImageElement,
        foreground: HTMLImageElement
    ) {
        const ratio = ensureSameAspectRatio(background, foreground)
        const x = ratio > 1 ? 1 : 1 / ratio
        const y = ratio > 1 ? ratio : 1
        this.backBuff = this.createDrawBuffer([
            -x, +y, -1, +1,
            -x, -y, -1, -1,
            +x, -y, +1, -1,
            +x, +y, +1, +1
        ])
        this.elemBuff = this.createElemBuffer([
            3, 0, 1, 1, 2, 3,  // Polygon_1
            7, 4, 5, 5, 6, 7,  // Polygon_2
            13, 8, 9, 13, 9, 10, 13, 10, 11, 11, 12, 13,  // Polygon_3
            20, 14, 15, 20, 15, 16, 20, 16, 17, 20, 17, 18, 18, 19, 20,  // Polygon_4
        ])
        this.drawBuff = this.createDrawBuffer([
            0.27781,0.34058, 0.39351,0.49586, 0.49912,0.54762, 0.49845,0.33954,  // Polygon_1
            0.71976,0.33954, 0.58590,0.50414, 0.49912,0.54762, 0.49778,0.34161,  // Polygon_2
            0.73792,0.74845, 0.70967,0.82298, 0.66998,0.82919, 0.62155,0.89130, 0.51863,0.91408, 0.51661,0.74948,  // Polygon_3
            0.27916,0.75052, 0.31414,0.81056, 0.32019,0.85921, 0.35786,0.86853, 0.40629,0.91304, 0.47962,0.91097, 0.47693,0.74845,  // Polygon_4
        ])
        this.texBackground = this.createTexture(background)
        this.texForeground = this.createTexture(foreground)
        this.prg = createProgram(gl)
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
    
    draw(index: number) {
        const { gl, prg } = this
        const w = gl.drawingBufferWidth
        const h = gl.drawingBufferHeight
        const { canvas } = gl
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w
            canvas.height = h
        }
        gl.viewport(0, 0, w, h)
        gl.bindBuffer( gl.ARRAY_BUFFER, this.drawBuff )
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.elemBuff )
        for (let index = 0; index < this.sprites.length; index++) {
            if (this.sprites[index] === 0) continue
            
            const offset = this.offsets[index]
            const size = this.sizes[index]
            gl.drawElements( gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset )
        }
    }
    
    private createDrawBuffer(data: number[]): WebGLBuffer {
        const { gl } = this
        const buff = gl.createBuffer()
        if (!buff) throw Error("Unable to create a WebGLBuffer!")
        
        gl.bindBuffer( gl.ARRAY_BUFFER, buff )
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(data),
            gl.STATIC_DRAW
        )
        return buff
    }
    
    private createElemBuffer(data: number[]): WebGLBuffer {
        const { gl } = this
        const buff = gl.createBuffer()
        if (!buff) throw Error("Unable to create a WebGLBuffer!")
        
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buff )
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(data),
            gl.STATIC_DRAW
        )
        return buff
    }
    
    createTexture(img: HTMLImageElement): WebGLTexture {
        const { gl } = this
        const tex = gl.createTexture()
        if (!tex) throw Error("Enable to create a WebGLTexture!")
        
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(
            gl.TEXTURE_2D, 0,
            gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        )
        return tex
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
uniform float uniZ;
in vec2 attPoint;
in vec2 attUV;
out vec2 varUV;

void main() {
    varUV = attUV;
    gl_Position = vec4(attPoint * uniAspectRatioContain, uniZ, 1.0);
}`
const FRAG = `#version 300 es

precision mediump float;

uniform sampler2D uniTexture;
in vec2 varUV;
out vec4 FragColor;

void main() {
    FragColor = texture( uniTexture, varUV );
}`
