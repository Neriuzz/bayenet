import EntityType from "../EntityType";
import ClickGesture from "../gestures/ClickGesture";
import IClickable from "../interfaces/IClickable";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";
import WorldState from "../WorldState";
import Node from "./Node";

export default class Edge implements IRenderable, IClickable {
	public renderable = true;
	public clickable = true;

	public zIndex = 0;
	public type = EntityType.EDGE;

	private state = WorldState.instance;

	constructor(public id: number, public size: number, public from: Node, public to?: Node) {}

	public copy(): Edge {
		let copy = new Edge(this.id, this.size, this.from, this.to);
		return copy;
	}

	public render(context: CanvasRenderingContext2D) {
		// Coordinates to where to draw the line from and to, and the angle to draw the line at
		let fromPos = this.from.position;
		let toPos = this.to ? this.to.position : this.state.mousePosition;
		let angle = Math.atan2((toPos.y - fromPos.y), (toPos.x - fromPos.x));
		let hypotenuse = Math.sqrt((fromPos.x- toPos.x) ** 2 + (fromPos.y - toPos.y) ** 2);

		context.translate(fromPos.x, fromPos.y);
		context.rotate(angle);

		// Line
		context.beginPath();
		context.lineWidth = 2.5;
		context.moveTo(this.from.r, 0);
		context.lineTo(hypotenuse - (this.to?.r || 0), 0);
		context.stroke();
		context.closePath();

		// Arrow
		context.beginPath();
		context.lineTo(hypotenuse - this.size - (this.to?.r || 0), this.size);
		context.lineTo(hypotenuse - (this.to?.r || 0), 0);
		context.lineTo(hypotenuse - this.size - (this.to?.r || 0), -this.size);
		context.fill();
		context.closePath();
	 }

	public isInView(cameraPosition: Vector2D, cameraBounds: Vector2D): boolean {
		return true;
	}

	public isMouseOver(position: Vector2D): boolean {
		return false;
	}

	public onClick(clickGesture: ClickGesture) {
		// TODO
	}

	public onDoubleClick(clickGesture: ClickGesture) {
		// TODO
	}
}