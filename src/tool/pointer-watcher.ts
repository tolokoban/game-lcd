export interface PointerWatcherEvent {
    x: number
    y: number
    button: "left" | "right" | "middle"
}

export interface PointerWatcherDragStartEvent extends PointerWatcherEvent {
    // Cancel dragging gesture.
    cancel(this: void): void
}

const TAP_DELAY = 300

export default class PointerWatcher {
    private _element: HTMLElement | null = null
    private timestamp = 0
    private button: "left" | "right" | "middle" = "left"
    // Coordinates of pointer down on element.
    private x = 0
    private y = 0
    // To convert document's coordinates to element's coordinates,
    // we use `documentShiftX` and `documentShiftY`.
    // Just add them to the document's coordinates to get the
    // element's one.
    private documentShiftX = 0
    private documentShiftY = 0
    private pointerIsDown = false
    private isDragging = false

    constructor(
        private readonly handlers: {
            onDown?: (evt: PointerWatcherEvent) => void
            onUp?: (evt: PointerWatcherEvent) => void
            onDragStart?: (evt: PointerWatcherDragStartEvent) => void
            onDrag?: (evt: PointerWatcherEvent) => void
            onDragEnd?: (evt: PointerWatcherEvent) => void
            onTap?: (evt: PointerWatcherEvent) => void
            onDoubleTap?: (evt: PointerWatcherEvent) => void
        }
    ) {}

    attach(element: HTMLElement) {
        this.detach()
        this._element = element
        element.addEventListener("pointerdown", this.handleElementPointerDown)
        element.addEventListener("contextmenu", this.handleContextMenu)
        document.addEventListener("pointerdown", this.handleDocumentPointerDown)
        document.addEventListener("pointermove", this.handleDocumentPointerMove)
        document.addEventListener("pointerup", this.handleDocumentPointerUp)
    }

    detach() {
        if (!this._element) return

        this._element.removeEventListener(
            "pointerdown",
            this.handleElementPointerDown
        )
        this._element.removeEventListener("contextmenu", this.handleContextMenu)
        document.removeEventListener(
            "pointerdown",
            this.handleDocumentPointerDown
        )
        document.removeEventListener(
            "pointermove",
            this.handleDocumentPointerMove
        )
        document.removeEventListener("pointerup", this.handleDocumentPointerUp)
    }

    private readonly handleElementPointerDown = (evt: PointerEvent) => {
        const { left, top } = (
            evt.target as HTMLElement
        ).getBoundingClientRect()
        this.timestamp = evt.timeStamp
        this.x = evt.clientX - left
        this.y = evt.clientY - top
        switch (evt.button) {
            case 0:
                this.button = "left"
                break
            case 1:
                this.button = "middle"
                break
            case 2:
                this.button = "right"
                break
        }
        this.pointerIsDown = true
    }

    private readonly handleDocumentPointerDown = (evt: PointerEvent) => {
        if (!this.pointerIsDown) return

        this.isDragging = true
        this.documentShiftX = this.x - evt.clientX
        this.documentShiftY = this.y - evt.clientY

        const { onDown, onDragStart } = this.handlers
        if (onDown) {
            onDown({
                x: this.x,
                y: this.y,
                button: this.button,
            })
        }
        if (onDragStart) {
            const evt: PointerWatcherDragStartEvent = {
                x: this.x,
                y: this.y,
                button: this.button,
                cancel: () => (this.isDragging = false),
            }
            onDragStart(evt)
        }
    }

    private readonly handleDocumentPointerMove = (evt: PointerEvent) => {
        if (!this.pointerIsDown || !this.isDragging) return

        const x = evt.clientX + this.documentShiftX
        const y = evt.clientY + this.documentShiftY
        const { onDrag } = this.handlers
        if (onDrag) {
            onDrag({
                x,
                y,
                button: this.button,
            })
        }
    }

    private readonly handleDocumentPointerUp = (evt: PointerEvent) => {
        const x = evt.clientX + this.documentShiftX
        const y = evt.clientY + this.documentShiftY
        const { onDragEnd, onUp, onTap } = this.handlers
        if (this.isDragging && onDragEnd) {
            onDragEnd({
                x,
                y,
                button: this.button,
            })
        }
        if (onUp) {
            onUp({
                x,
                y,
                button: this.button,
            })
        }
        if (onTap) {
            const deltaTime = evt.timeStamp - this.timestamp
            if (deltaTime < TAP_DELAY) {
                onTap({
                    x,
                    y,
                    button: this.button,
                })
            }
        }
        this.isDragging = false
        this.pointerIsDown = false
    }

    private readonly handleContextMenu = (evt: Event) => {
        evt.stopPropagation()
        evt.preventDefault()
    }
}
