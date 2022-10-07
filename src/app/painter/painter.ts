import Polygon from "./polygon"
import { debounce } from "../../tool/async"
import { Point, PolygonItem } from "@/data/types"
import { PointerWatcherEvent } from "@/tool/pointer-watcher"
import { Triangle } from "@/tool/triangulate"
import PointerWatcher, {
    PointerWatcherDragStartEvent,
} from "@/tool/pointer-watcher"

const DOT_RADIUS = 10

export default class Painter {
    public readonly polygon = new Polygon()
    private _image: HTMLImageElement = new Image()
    private _canvas: HTMLCanvasElement
    private readonly observer: ResizeObserver
    private scale = 1
    private x = 0
    private y = 0
    private readonly watcher: PointerWatcher
    private triangles: Triangle[] = []
    /** Index of the polygon's point that has been selected. */
    private selectedPoint = -1
    private xRayMode = false

    constructor() {
        this._canvas = document.createElement("canvas")
        this.observer = new ResizeObserver(this.handleResize)
        this.watcher = new PointerWatcher({
            onDragStart: this.handleDragStart,
            onDrag: this.handleDrag,
            onDragEnd: this.handleDragEnd,
        })
        document.addEventListener("keydown", this.handleKeyDown)
        document.addEventListener("keyup", this.handleKeyUp)
        this.polygon.eventChange.add(this.triangulateLater)
    }

    private readonly handleKeyDown = (evt: KeyboardEvent) => {
        if (evt.key === " ") {
            this.xRayMode = true
            this.paint()
        }
    }

    private readonly handleKeyUp = (evt: KeyboardEvent) => {
        if (evt.key === " ") {
            this.xRayMode = false
            this.paint()
        }
    }

    resetPolygon(polygonItem: PolygonItem) {
        this.polygon.reset(polygonItem.points)
        this.triangulate()
    }

    get canvas() {
        return this._canvas
    }
    set canvas(canvas: HTMLCanvasElement) {
        if (this._canvas) {
            this.watcher.detach()
            this.observer.unobserve(this._canvas)
        }
        this._canvas = canvas
        this.watcher.attach(canvas)
        this.observer.observe(canvas)
        this.paint()
    }

    private readonly handleDrag = (evt: PointerWatcherEvent) => {
        const { polygon } = this
        if (!polygon) return

        if (this.selectedPoint < 0) return

        const x = evt.x / this.scale
        const y = evt.y / this.scale
        const point = polygon.getPoint(this.selectedPoint)
        point.x = x
        point.y = y
        this.triangulate()
    }

    private readonly handleDragEnd = (evt: PointerWatcherEvent) => {
        const { polygon } = this
        if (!polygon) return

        polygon.fireChange()
    }

    private readonly handleDragStart = (evt: PointerWatcherDragStartEvent) => {
        const x = evt.x / this.scale
        const y = evt.y / this.scale
        if (evt.button === "left") {
            if (this.addDot({ x, y })) evt.cancel()
            else {
                console.log("Dragging:", this.selectedPoint)
            }
        } else if (evt.button === "right") {
            evt.cancel()
            this.removeDot(x, y)
        } else {
            evt.cancel()
            this.triangulate()
        }
    }

    /**
     * Add a dot if we click far from any existing one.
     * Otherwise, return false and remember what dot has been selected.
     */
    private addDot(point: Point): boolean {
        const { polygon } = this
        if (!polygon) return false

        const pointIndex = polygon.findPoint(point)
        this.selectedPoint = pointIndex

        if (polygon.length < 3) {
            this.selectedPoint = polygon.add(point)
            this.triangulate()
            return true
        }

        if (pointIndex > -1) return false

        let bestIndex = polygon.length
        let bestDistance = Number.MAX_SAFE_INTEGER
        for (let idx = 0; idx < polygon.length; idx++) {
            const distance = polygon.distFromEdge(point, idx, idx + 1)
            console.log(`[${idx}, ${idx + 1}]`, distance)
            if (distance < bestDistance) {
                bestDistance = distance
                bestIndex = idx + 1
            }
        }
        this.selectedPoint = polygon.add(point, bestIndex)
        this.triangulate()
        return true
    }

    private removeDot(x: number, y: number) {
        const { polygon } = this
        if (!polygon) return

        const index = polygon.findPoint({ x, y })
        if (index > -1) {
            polygon.remove(index)
            this.triangulate()
        }
    }

    private readonly triangulateLater = debounce(() => {
        this.triangulate()
    }, 300)

    private triangulate() {
        const { polygon } = this
        this.triangles = polygon.triangulate()
        this.paint()
        window.sessionStorage.setItem("polygon", JSON.stringify(polygon))
    }

    get image() {
        return this._image
    }
    set image(image: HTMLImageElement) {
        this._image = image
        this.paint()
    }

    get ctx() {
        const ctx = this.canvas.getContext("2d")
        if (!ctx) throw Error("Unable to create 2D context!")

        return ctx
    }

    paint() {
        window.requestAnimationFrame(() => {
            const { ctx, image, polygon } = this
            ctx.canvas.width = Math.ceil(ctx.canvas.clientWidth)
            ctx.canvas.height = Math.ceil(ctx.canvas.clientHeight)
            const w = ctx.canvas.width
            const h = ctx.canvas.height
            const scale = Math.min(w / image.width, h / image.height)
            this.scale = scale
            ctx.clearRect(0, 0, w, h)
            ctx.save()
            ctx.scale(scale, scale)
            if (this.xRayMode) {
                this.paintXRay(ctx)
            } else {
                this.paintDefault(ctx)
            }
        })
    }

    private paintDefault(ctx: CanvasRenderingContext2D) {
        const { image, polygon } = this
        ctx.save()
        ctx.drawImage(image, 0, 0)
        ctx.fillStyle = "#0f03"
        for (const [a, b, c] of this.triangles) {
            ctx.beginPath()
            const A = polygon.getPoint(a)
            const B = polygon.getPoint(b)
            const C = polygon.getPoint(c)
            ctx.moveTo(A.x, A.y)
            ctx.lineTo(B.x, B.y)
            ctx.lineTo(C.x, C.y)
            ctx.closePath()
            ctx.fill()
        }
        ctx.restore()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 3
        ctx.beginPath()
        const [{ x, y }, ...nextPoints] = polygon.points
        ctx.moveTo(x, y)
        for (const { x, y } of nextPoints) ctx.lineTo(x, y)
        ctx.closePath()
        ctx.stroke()
        ctx.font = `bold ${Math.ceil(DOT_RADIUS * 1.5)}px sans-serif`
        ctx.textBaseline = "middle"
        ctx.textAlign = "center"
        let index = 0
        for (const { x, y } of polygon.points) {
            ctx.fillStyle = "#000"
            ctx.beginPath()
            ctx.ellipse(x, y, DOT_RADIUS, DOT_RADIUS, 0, 0, Math.PI * 2)
            ctx.fill()
            ctx.fillStyle = "#fff"
            ctx.fillText(`${index++}`, x, y)
        }
        ctx.restore()
    }

    private paintXRay(ctx: CanvasRenderingContext2D) {
        const { image, polygon } = this
        ctx.save()
        ctx.globalAlpha = 0.1
        ctx.drawImage(image, 0, 0)
        ctx.beginPath()
        const [{ x, y }, ...nextPoints] = polygon.points
        ctx.moveTo(x, y)
        for (const { x, y } of nextPoints) ctx.lineTo(x, y)
        ctx.closePath()
        ctx.clip()
        ctx.globalAlpha = 1
        ctx.drawImage(image, 0, 0)
        ctx.restore()
    }

    private readonly handleResize = () => {
        const { canvas } = this
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
        this.paint()
    }
}
