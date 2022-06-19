// Camera
import Camera from "../Camera";

// Gestures
import { ClickGesture, DragGesture, KeyGesture } from "../gestures";

// Utility
import Vector2D from "../util/Vector2D";

// Eventbus singleton
import EventBus from "../../shared/EventBus";
const eventBus = EventBus.instance;
export default class Board {
    public dragging = false;

    private currentPosition = new Vector2D(0, 0);
    private dragStartPosition = new Vector2D(0, 0);

    public readonly camera: Camera;

    constructor(public readonly canvas: HTMLCanvasElement, public readonly context: CanvasRenderingContext2D) {
        this.camera = new Camera(this.canvas, this.context);
    }

    public onClick(clickGesture: ClickGesture) {
        eventBus.emit("toggleNodeInformation");

        if (clickGesture.world.edgeBeingCreated) clickGesture.world.undo();

        clickGesture.world.deselectAllClickables();
    }

    public onDoubleClick(clickGesture: ClickGesture) {
        clickGesture.world.createNode(clickGesture.position);
    }

    public onDragStart(dragGesture: DragGesture) {
        this.dragging = true;
        this.dragStartPosition = new Vector2D(
            dragGesture.position.x - this.currentPosition.x,
            dragGesture.position.y - this.currentPosition.y
        );
    }

    public onDrag(dragGesture: DragGesture) {
        if (!this.dragging) return;

        this.currentPosition = new Vector2D(
            dragGesture.position.x - this.dragStartPosition.x,
            dragGesture.position.y - this.dragStartPosition.y
        );
        this.camera.position = this.currentPosition;
    }

    public onDragEnd() {
        this.dragging = false;
    }

    public onKeyDown(keyGesture: KeyGesture) {
        if (keyGesture.key == "Delete" && keyGesture.world.numberOfClickablesSelected > 0) {
            keyGesture.world.removeAllSelectedClickables();
            return;
        }

        if (keyGesture.key == "a" && keyGesture.ctrl) {
            if (keyGesture.world.numberOfClickablesSelected == keyGesture.world.clickablesSize)
                keyGesture.world.deselectAllClickables();
            else keyGesture.world.selectAllClickables();
            return;
        }

        if (keyGesture.key == "z" && keyGesture.ctrl) keyGesture.world.undo();
    }
}
