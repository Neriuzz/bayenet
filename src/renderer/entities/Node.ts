import ClickGesture from "../gestures/ClickGesture";
import IClickable from "../interfaces/IClickable";
import IHoverable from "../interfaces/IHoverable";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";
import DraggableEntity from "./DraggableEntity";

export default class Node extends DraggableEntity implements IRenderable, IClickable, IHoverable {
	public clickable = true;
	public hoverable = true;
	public hovering = false;
	public selected = false;

	constructor(public id: number, currentPosition: Vector2D, private r: number) {
		super(id, currentPosition);
	}

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
		this.selected = !this.selected;

		if (!clickGesture.altPressed)
			clickGesture.selected?.forEach(clickable => clickable.selected = false);

		console.log(this);
	}

	public onDoubleClick(clickGesture: ClickGesture) {
		console.log(`Double-clicked on node ${this.id}`);
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