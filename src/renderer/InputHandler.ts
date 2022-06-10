// Gestures
import { ClickGesture, DragGesture, HoverGesture, KeyGesture } from "./gestures";
// Interfaces
import IClickable from "./interfaces/IClickable";
import IDoubleClickable from "./interfaces/IDoubleClickable";
import IDraggable from "./interfaces/IDraggable";
import IHoverable from "./interfaces/IHoverable";
import IInteractable from "./interfaces/IInteractable";
// Required imports
import Vector2D from "./util/Vector2D";
import World from "./World";

const MAX_ZOOM = 2;
const MIN_ZOOM = 0.5;
const SCROLL_SENSITIVITY = 0.0005;
export default class InputHandler {
    private draggingSomething = false;

    // Timer for differentiating between clicks and double clicks
    private timer = 0;

    constructor(private world: World) {
        // Register window event listeners
        window.addEventListener("resize", () => this.onResize());

        // Register canvas event listeners
        this.world.board.canvas.addEventListener("mousedown", (event: MouseEvent) => this.onMouseDown(event));
        this.world.board.canvas.addEventListener("mouseup", (event: MouseEvent) => this.onMouseUp(event));
        this.world.board.canvas.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
        this.world.board.canvas.addEventListener("click", (event: MouseEvent) => this.onClick(event));
        this.world.board.canvas.addEventListener("dblclick", (event: MouseEvent) => this.onDoubleClick(event));
        this.world.board.canvas.addEventListener("keydown", (event: KeyboardEvent) => this.onKeyDown(event));
        this.world.board.canvas.addEventListener("wheel", (event: WheelEvent) => this.onScroll(event));

        // Initial canvas resize
        this.onResize();
    }

    private getInteractable(interactables: IInteractable[], position: Vector2D): IInteractable {
        const [interactable] = interactables
            .filter((interactable) => interactable.isMouseOver(position))
            .sort((a, b) => a.zIndex - b.zIndex)
            .reverse();

        return interactable;
    }

    public getZIndex(draggable: IDraggable, position: Vector2D): number {
        const [interactable] = this.world.interactablesInView
            .filter((interactable) => interactable.id !== draggable.id && interactable.isMouseOver(position))
            .sort((a, b) => a.zIndex - b.zIndex)
            .reverse();

        return interactable?.zIndex + 1 || 1;
    }

    public getTruePosition(event: MouseEvent) {
        return new Vector2D(
            event.clientX - this.world.board.camera.position.x / this.world.board.camera.scaleFactor,
            event.clientY - this.world.board.camera.position.y / this.world.board.camera.scaleFactor
        );
    }

    public getDragPosition(event: MouseEvent) {
        return new Vector2D(
            event.clientX / this.world.board.camera.scaleFactor,
            event.clientY / this.world.board.camera.scaleFactor
        );
    }

    private onScroll(event: WheelEvent) {
        this.world.board.camera.scaleFactor += event.deltaY * SCROLL_SENSITIVITY;

        this.world.board.camera.scaleFactor = Math.min(this.world.board.camera.scaleFactor, MAX_ZOOM);
        this.world.board.camera.scaleFactor = Math.max(this.world.board.camera.scaleFactor, MIN_ZOOM);
    }

    private onKeyDown(event: KeyboardEvent) {
        event.preventDefault();

        const keyGesture: KeyGesture = {
            key: event.key,
            ctrl: event.ctrlKey,
            alt: event.altKey,
            shift: event.shiftKey,
            world: this.world
        };

        this.world.board.onKeyDown(keyGesture);
    }

    private onClick(event: MouseEvent) {
        event.preventDefault();

        // Do not call on click handler if we are currently dragging or this is our second click
        if (this.draggingSomething || event.detail !== 1) return;

        const position = this.getTruePosition(event);

        this.timer = setTimeout(() => {
            const clickGesture: ClickGesture = {
                position,
                alt: event.altKey,
                shift: event.shiftKey,
                world: this.world
            };

            const clickable = this.getInteractable(this.world.clickablesInView, position) as IClickable;

            clickable ? clickable.onClick(clickGesture) : this.world.board.onClick(clickGesture);
        }, 200);
    }

    private onDoubleClick(event: MouseEvent) {
        event.preventDefault();

        clearTimeout(this.timer!);

        if (this.world.edgeBeingCreated) return;

        const position = this.getTruePosition(event);
        const clickGesture: ClickGesture = {
            position,
            alt: event.altKey,
            shift: event.shiftKey,
            world: this.world
        };

        const doubleClickable = this.getInteractable(this.world.doubleClickablesInView, position) as IDoubleClickable;

        doubleClickable ? doubleClickable.onDoubleClick(clickGesture) : this.world.board.onDoubleClick(clickGesture);
    }

    private onMouseDown(event: MouseEvent) {
        event.preventDefault();

        this.draggingSomething = false;

        const position = this.getDragPosition(event);

        const dragGesture: DragGesture = {
            position
        };

        const draggable = this.getInteractable(this.world.draggablesInView, this.getTruePosition(event)) as IDraggable;

        draggable ? draggable.onDragStart(dragGesture) : this.world.board.onDragStart(dragGesture);
    }

    private onMouseMove(event: MouseEvent) {
        event.preventDefault();

        const position = this.getDragPosition(event);

        if (this.world.edgeBeingCreated) this.world.edgeBeingCreated.drawingPosition = this.getTruePosition(event);

        this.draggingSomething = true;

        if (this.world.board.dragging) {
            const dragGesture: DragGesture = {
                position
            };
            this.world.board.onDrag(dragGesture);
            return;
        }

        if (this.world.currentlyDragging) {
            const zIndex = Number.MAX_SAFE_INTEGER;
            const dragGesture: DragGesture = {
                position,
                zIndex
            };
            this.world.currentlyDragging.onDrag(dragGesture);
            return;
        }

        this.onHover(this.getTruePosition(event));
    }

    private onMouseUp(event: MouseEvent) {
        event.preventDefault();

        const position = this.getDragPosition(event);

        if (this.world.board.dragging) {
            this.world.board.onDragEnd();
            return;
        }

        if (this.world.currentlyDragging) {
            const zIndex = this.getZIndex(this.world.currentlyDragging, this.getTruePosition(event));
            const dragGesture: DragGesture = {
                position,
                zIndex
            };
            this.world.currentlyDragging.onDragEnd(dragGesture);
        }
    }

    private onHover(position: Vector2D) {
        if (this.world.currentlyHoveringOver) {
            if (this.world.currentlyHoveringOver.isMouseOver(position)) this.world.currentlyHoveringOver.onHovering();
            else this.world.currentlyHoveringOver.onExitHover();
            return;
        }

        const hoverable = this.getInteractable(this.world.hoverablesInView, position) as IHoverable;
        hoverable?.onEnterHover();
    }

    private onResize() {
        // Scale and resize the canvas appropriately based on device width, height and pixel ratio
        this.world.board.canvas.width = this.world.board.canvas.clientWidth * window.devicePixelRatio;
        this.world.board.canvas.height = this.world.board.canvas.clientHeight * window.devicePixelRatio;
        this.world.board.canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
    }
}
