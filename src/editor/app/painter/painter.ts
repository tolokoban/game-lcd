import Data from "@/editor/data/data"
import Polygon from "./polygon"
import { debounce } from "@/editor/tool/async"
import { Point, PolygonItem } from "@/editor/data/types"
import { PointerWatcherEvent } from "@/editor/tool/pointer-watcher"
import { Triangle } from "@/editor/tool/triangulate"
import PointerWatcher, {
    PointerWatcherDragStartEvent,
} from "@/editor/tool/pointer-watcher"

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
    /**
     * pointsToMoveTogether, originX and originY are used
     * to move all the points of the current polygon together.
     */
    private pointsToMoveTogether: Point[] = []
    private originX = 0
    private originY = 0

    constructor(private data: Data) {
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

        const x = evt.x / this.scale
        const y = evt.y / this.scale
        console.log("🚀 [painter] evt.button = ", evt.button) // @FIXME: Remove this line written on 2022-10-10 at 16:57
        if (evt.button === "right") {
            for (let i = 0; i < this.pointsToMoveTogether.length; i++) {
                const { x: xO, y: yO } = this.pointsToMoveTogether[i]
                polygon.points[i].x = xO + x - this.originX
                polygon.points[i].y = yO + y - this.originY
            }
            this.paint()
        } else if (evt.button === "left") {
            if (this.selectedPoint < 0) return

            const point = polygon.getPoint(this.selectedPoint)
            point.x = x
            point.y = y
            this.triangulate()
        }
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
        } else if (evt.button === "middle") {
            evt.cancel()
            this.removeDot(x, y)
        } else {
            console.log("🚀 [painter] evt.button = ", evt.button) // @FIXME: Remove this line written on 2022-10-10 at 16:58
            this.pointsToMoveTogether = this.polygon.points.map((p) => ({
                ...p,
            }))
            this.originX = x
            this.originY = y
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
        const { data, image, polygon } = this
        ctx.save()
        ctx.globalAlpha = 0.5
        ctx.drawImage(image, 0, 0)
        ctx.globalAlpha = 1
        ctx.save()
        ctx.beginPath()
        for (const poly of data.getPolygonList()) {
            const [{ x, y }, ...nextPoints] = poly.points
            ctx.moveTo(x, y)
            for (const { x, y } of nextPoints) ctx.lineTo(x, y)
            ctx.lineTo(x, y)
        }
        ctx.clip()
        ctx.drawImage(image, 0, 0)
        ctx.restore()
        // ctx.fillStyle = "#0f03"
        // for (const [a, b, c] of this.triangles) {
        //     ctx.beginPath()
        //     const A = polygon.getPoint(a)
        //     const B = polygon.getPoint(b)
        //     const C = polygon.getPoint(c)
        //     ctx.moveTo(A.x, A.y)
        //     ctx.lineTo(B.x, B.y)
        //     ctx.lineTo(C.x, C.y)
        //     ctx.closePath()
        //     ctx.fill()
        // }
        if (polygon.points.length > 0) {
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
