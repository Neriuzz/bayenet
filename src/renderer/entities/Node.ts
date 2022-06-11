import EventBus from "../../shared/EventBus";
import { ClickGesture, DragGesture } from "../gestures";
import IClickable from "../interfaces/IClickable";
import IDoubleClickable from "../interfaces/IDoubleClickable";
import IDraggable from "../interfaces/IDraggable";
import IHoverable from "../interfaces/IHoverable";
import IRenderable from "../interfaces/IRenderable";
import isCyclic from "../util/GraphUtil";
import Vector2D from "../util/Vector2D";
import Edge from "./Edge";

export default class Node implements IRenderable, IClickable, IDoubleClickable, IDraggable, IHoverable {
    public selected = false;
    public dragging = false;
    public hovering = false;

    public zIndex = 1;
    public previousZIndex = 1;
    private dragStartPosition = new Vector2D(0, 0);

    private eventBus = EventBus.instance;

    public edges: Edge[] = [];

    public name: string;

    constructor(public readonly id: number, private currentPosition: Vector2D, public r: number) {
        this.name = `Node ${this.id}`;
    }

    public render(context: CanvasRenderingContext2D) {
        // Draw circle
        context.save();
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
        context.fillStyle = "red";
        if (this.selected) {
            context.strokeStyle = "blue";
            context.lineWidth = 6;
            context.lineCap = "round";
            context.stroke();
        }
        context.fill();
        context.closePath();
        context.restore();

        // Draw node name
        context.save();

        // Truncate the name of the node if it too long
        let name = this.name;
        if (context.measureText(name).width * window.devicePixelRatio > 40) {
            while (context.measureText(name).width * window.devicePixelRatio > 30)
                name = name.substring(0, name.length - 1);
            name += "...";
        }

        // Get new width of text
        const textWidth = context.measureText(name).width * window.devicePixelRatio;

        context.font = "12px Arial";
        context.textBaseline = "middle";
        // TODO: Text doesn't look fully centered
        context.fillText(name, this.position.x - textWidth / 2, this.position.y - this.r * 1.25);
        context.restore();
    }

    public isInView(cameraPosition: Vector2D, canvasBounds: Vector2D, transformedOrigin: Vector2D): boolean {
        return (
            this.position.x + this.r + cameraPosition.x >= transformedOrigin.x &&
            this.position.y + this.r + cameraPosition.y >= transformedOrigin.y &&
            this.position.x - this.r + cameraPosition.x < transformedOrigin.x + canvasBounds.x &&
            this.position.y - this.r + cameraPosition.y < transformedOrigin.y + canvasBounds.y
        );
    }

    public isMouseOver(position: Vector2D): boolean {
        return (position.x - this.position.x) ** 2 + (position.y - this.position.y) ** 2 <= this.r ** 2;
    }

    public get parents(): Node[] {
        return this.edges.filter((edge) => edge.from !== this).map((edge) => edge.from);
    }

    public get children(): Node[] {
        return this.edges.filter((edge) => edge.to && edge.to !== this).map((edge) => edge.to!);
    }

    public get position(): Vector2D {
        return this.currentPosition;
    }

    public onClick(clickGesture: ClickGesture) {
        if (clickGesture.world.edgeBeingCreated) {
            const edge = clickGesture.world.edgeBeingCreated;
            edge.to = this;
            edge.zIndex = 0;
            edge.from.zIndex = edge.from.previousZIndex;
            this.edges.push(edge);
            if (edge.from.id === this.id || isCyclic(clickGesture.world.nodes)) clickGesture.world.undo();
            return;
        }

        if (clickGesture.shift) {
            const edge = clickGesture.world.createEdge(this);
            edge.zIndex = Number.MAX_SAFE_INTEGER - 1;
            this.previousZIndex = this.zIndex;
            this.zIndex = Number.MAX_SAFE_INTEGER;
            this.edges.push(edge);
            return;
        }

        this.selected = !this.selected;

        if (!clickGesture.alt) clickGesture.world.deselectAllClickables(this.id);
    }

    public onDoubleClick(clickGesture: ClickGesture) {
        this.eventBus.emit("toggleSidebar", this);
    }

    public onDragStart(dragGesture: DragGesture) {
        this.dragging = true;
        this.dragStartPosition = new Vector2D(
            dragGesture.position.x - this.currentPosition.x,
            dragGesture.position.y - this.currentPosition.y
        );
    }

    public onDrag(dragGesture: DragGesture) {
        this.zIndex = dragGesture.zIndex || this.zIndex;
        this.currentPosition = new Vector2D(
            dragGesture.position.x - this.dragStartPosition.x,
            dragGesture.position.y - this.dragStartPosition.y
        );
    }

    public onDragEnd(dragGesture: DragGesture) {
        this.dragging = false;
        this.zIndex = dragGesture.zIndex || this.zIndex;
    }

    public onEnterHover() {
        this.hovering = true;
        console.log(`Started hovering over node ${this.id}`);
    }

    public onHovering() {
        console.log(`Hovering over node ${this.id}`);
    }

    public onExitHover() {
        this.hovering = false;
        console.log(`Stopped hovering over node ${this.id}`);
    }
}
