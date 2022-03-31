import EntityType from "../EntityType";
import ClickGesture from "../gestures/ClickGesture";
import DragGesture from "../gestures/DragGesture";
import IClickable from "../interfaces/IClickable";
import IDraggable from "../interfaces/IDraggable";
import IHoverable from "../interfaces/IHoverable";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";
import WorldState from "../WorldState";
import Edge from "./Edge";

export default class Node implements IRenderable, IClickable, IDraggable, IHoverable {
	public renderable = true;
	public clickable = true;
	public hoverable = true;
	public draggable = true;

	public selected = false;
	public dragging = false;
	public hovering = false;

	public zIndex = 1;
	public type = EntityType.NODE;

	private initialPosition: Vector2D | null = null;
	private dragStartPosition: Vector2D | null = null;

	private state = WorldState.instance;

	public edge: Edge | null = null;

	constructor(public id: number, private currentPosition: Vector2D, public r: number) {}

	public render(context: CanvasRenderingContext2D) {
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
	}

	public isInView(cameraPosition: Vector2D, canvasBounds: Vector2D): boolean {
		return ( 
			(this.position.x + this.r + cameraPosition.x >= 0 && this.position.y + this.r + cameraPosition.y >= 0) && 
			(this.position.x - this.r + cameraPosition.x < canvasBounds.x && this.position.y - this.r + cameraPosition.y < canvasBounds.y)
		);
	}

	public isMouseOver(position: Vector2D): boolean {
		return (
			(position.x - this.position.x) ** 2 + 
			(position.y - this.position.y) ** 2 <= this.r ** 2
		);
	}

	public onClick(clickGesture: ClickGesture) {
		if (this.state.edgeBeingCreated) {
			if (this !== this.state.edgeBeingCreated.from) {
				this.state.edgeBeingCreated.to = this;
				this.edge = this.state.edgeBeingCreated;
			}
			else 
				clickGesture.world!.removeEntity(this.state.edgeBeingCreated);

			this.state.edgeBeingCreated = null;
			return;
		}

		if (clickGesture.shift) {
			this.edge = clickGesture.world!.createEdge(this);
			this.state.edgeBeingCreated = this.edge;
			return;
		}

		this.selected = !this.selected;

		if (!clickGesture.alt)
			this.state.clearSelected();

		if (this.selected)
			this.state.addToSelected(this);
		else
			this.state.removeFromSelected(this);
	}

	public onDoubleClick(clickGesture: ClickGesture) {
		console.log(`Double-clicked on node ${this.id}`);
	}

	public onDragStart(dragGesture: DragGesture) {
		this.dragging = true;
		this.dragStartPosition = dragGesture.position;
		this.initialPosition = new Vector2D(this.currentPosition.x, this.currentPosition.y);
		this.state.currentlyDragging = this;
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
		this.state.currentlyDragging = null;
	}

	public get position(): Vector2D {
		return this.currentPosition;
	}

	public onEnterHover() {
		this.hovering = true;
		console.log(`Started hovering over node ${this.id}`);
		this.state.currentlyHovering = this;
	}

	public onHovering() {
		console.log(`Hovering over node ${this.id}`);
	}

	public onExitHover() {
		this.hovering = false;
		console.log(`Stopped hovering over node ${this.id}`);
		this.state.currentlyHovering = null;
	}
};