import ClickGesture from "../gestures/ClickGesture";
import DragGesture from "../gestures/DragGesture";
import IClickable from "../interfaces/IClickable";
import IDraggable from "../interfaces/IDraggable";
import IHoverable from "../interfaces/IHoverable";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";
import WorldState from "../WorldState";
import Edge from "./Edge";
import isCyclic from "../util/GraphUtil";
import EventBus from "@/events/EventBus";

export default class Node implements IRenderable, IClickable, IDraggable, IHoverable {
	public renderable = true;
	public clickable = true;
	public hoverable = true;
	public draggable = true;

	public selected = false;
	public dragging = false;
	public hovering = false;

	public zIndex = 1;

	private initialPosition: Vector2D | null = null;
	private dragStartPosition: Vector2D | null = null;

	private eventBus = EventBus.instance;

	public edges: Edge[] = [];

	public name: string;

	constructor(public id: number, private currentPosition: Vector2D, public r: number) {
		this.name = `Node #${this.id}`;
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
		context.font = "11px Arial";
		context.textBaseline = "middle";
		context.fillText(this.name, this.position.x - this.r / 1.5, this.position.y);
		context.restore();
	}

	public isInView(cameraPosition: Vector2D, canvasBounds: Vector2D): boolean {
		return ( 
			(this.position.x + this.r + cameraPosition.x >= 0 && this.position.y + this.r + cameraPosition.y >= 0) && 
			(this.position.x - this.r + cameraPosition.x < canvasBounds.x && this.position.y - this.r + cameraPosition.y < canvasBounds.y)
		);
	}

	public isMouseOver(position: Vector2D): boolean {
		return ((position.x - this.position.x) ** 2 + (position.y - this.position.y) ** 2) <= this.r ** 2;
	}

	public get parents(): Node[] {
		return this.edges.filter(edge => edge.from !== this).map(edge => edge.from);
	}

	public get children(): Node[] {
		return this.edges.filter(edge => edge.to && edge.to !== this).map(edge => edge.to!);
	}

	public get position(): Vector2D {
		return this.currentPosition;
	}

	public onClick(clickGesture: ClickGesture) {
		if (clickGesture.world.edgeBeingCreated) {
			let edge = clickGesture.world.edgeBeingCreated
			edge.to = this;
			this.edges.push(edge);
			if (edge.from.id === this.id || isCyclic(clickGesture.world.nodes))
				clickGesture.world.undo();
			return;
		}

		if (clickGesture.shift) {
			let edge = clickGesture.world.createEdge(this);
			this.edges.push(edge);
			return;
		}

		this.selected = !this.selected;

		if (!clickGesture.alt)
			clickGesture.world.deselectAllClickables(this.id);
	}

	public onDoubleClick(clickGesture: ClickGesture) {
		this.eventBus.emit("toggleSidebar", this);
	}

	public onDragStart(dragGesture: DragGesture) {
		this.dragging = true;
		this.dragStartPosition = dragGesture.position;
		this.initialPosition = new Vector2D(this.currentPosition.x, this.currentPosition.y);
	}

	public onDrag(dragGesture: DragGesture) {
		this.zIndex = dragGesture.zIndex || this.zIndex;
		let deltaPosition = new Vector2D(dragGesture.position.x - this.dragStartPosition!.x, dragGesture.position.y - this.dragStartPosition!.y);
		this.currentPosition = new Vector2D(this.initialPosition!.x + deltaPosition.x, this.initialPosition!.y + deltaPosition.y);
	}
	
	public onDragEnd(dragGesture: DragGesture) {
		this.dragging = false;
		this.dragStartPosition = null;
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
};