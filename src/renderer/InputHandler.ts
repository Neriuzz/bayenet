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

// Event bus
import EventBus from "../shared/EventBus";
const eventBus = EventBus.instance;

// Constants for zooming functionality
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.5;
const SCROLL_SENSITIVITY = 0.0005;

export default class InputHandler {
    private dragging = false;

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

    private getOffsetPosition(event: MouseEvent) {
        return new Vector2D(
            event.clientX - this.world.board.camera.position.x * this.world.board.camera.scaleFactor,
            event.clientY - this.world.board.camera.position.y * this.world.board.camera.scaleFactor
        );
    }

    public getTruePosition(event: MouseEvent) {
        const canvasWidth = this.world.board.canvas.width;
        const canvasHeight = this.world.board.canvas.height;
        const scaleFactor = this.world.board.camera.scaleFactor;
        const offsetPosition = this.getOffsetPosition(event);

        return new Vector2D(
            (canvasWidth - canvasWidth / scaleFactor) / 2 + offsetPosition.x / scaleFactor,
            (canvasHeight - canvasHeight / scaleFactor) / 2 + offsetPosition.y / scaleFactor
        );
    }

    public getDragPosition(event: MouseEvent) {
        return new Vector2D(
            event.clientX / this.world.board.camera.scaleFactor,
            event.clientY / this.world.board.camera.scaleFactor
        );
    }

    private onScroll(event: WheelEvent) {
        // Update the scale factor
        let deltaY = event.deltaY * SCROLL_SENSITIVITY;

        // Invert scroll
        if (this.world.board.camera.scrollInverted) deltaY = -deltaY;

        this.world.board.camera.scaleFactor += deltaY;

        // Clamp the scale factor to a maximum and minimum value
        this.world.board.camera.scaleFactor = Math.min(this.world.board.camera.scaleFactor, MAX_ZOOM);
        this.world.board.camera.scaleFactor = Math.max(this.world.board.camera.scaleFactor, MIN_ZOOM);

        // Call the on mouse move event as the mouse position will change when scrolling
        this.onMouseMove(event as MouseEvent);
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

        // Call the onKeyDown handler of the board
        this.world.board.onKeyDown(keyGesture);
    }

    private onClick(event: MouseEvent) {
        event.preventDefault();

        // Do not call on click handler if we are currently dragging or this is our second click
        if (this.dragging || event.detail !== 1) return;

        // Get the position of the click, accounting for context transformations
        const position = this.getTruePosition(event);

        // Set a click delay to differentiate between single and double clicks
        this.timer = setTimeout(
            () => {
                const clickGesture: ClickGesture = {
                    position,
                    alt: event.altKey,
                    shift: event.shiftKey,
                    world: this.world
                };

                // Attempt the retrieve the clickable that the mouse is hovering over
                const clickable = this.getInteractable(this.world.clickablesInView, position) as IClickable;

                // If there is a clickable, call its onclick handler, otherwise call the onclick handler of the board itself
                clickable ? clickable.onClick(clickGesture) : this.world.board.onClick(clickGesture);

                // Call on mouse move handler
                this.onMouseMove(event);
            },
            // Set the click delay to 0 if we are currently creating an edge
            this.world.edgeBeingCreated || event.shiftKey ? 0 : 200
        );
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

        // Call the on hover event as mouse will be over newly created node
        this.onHover(position);
    }

    private onMouseDown(event: MouseEvent) {
        event.preventDefault();

        this.dragging = false;

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

        this.dragging = true;

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
        const hoverGesture: HoverGesture = {
            world: this.world
        };

        if (this.world.currentlyHoveringOver) {
            if (this.world.currentlyHoveringOver.isMouseOver(position)) return;
            else this.world.currentlyHoveringOver.onExitHover(hoverGesture);
            return;
        }

        const hoverable = this.getInteractable(this.world.hoverablesInView, position) as IHoverable;
        hoverable?.onEnterHover(hoverGesture);
    }

    private onResize() {
        // Scale and resize the canvas appropriately based on device width, height and pixel ratio
        this.world.board.canvas.width = this.world.board.canvas.clientWidth * window.devicePixelRatio;
        this.world.board.canvas.height = this.world.board.canvas.clientHeight * window.devicePixelRatio;
        this.world.board.canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
    }
}
