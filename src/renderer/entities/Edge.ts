import { ClickGesture } from "../gestures";
import IClickable from "../interfaces/IClickable";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";
import Node from "./Node";

export default class Edge implements IRenderable, IClickable {
	public renderable = true;
	public clickable = true;

	public zIndex = 0;
	public selected = false;

	constructor(
		public id: number,
		public size: number,
		public from: Node,
		public drawingPosition: Vector2D,
		public to?: Node
	) {}

	public render(context: CanvasRenderingContext2D) {
		// Coordinates to where to draw the line from and to, and the angle to draw the line at
		const fromPos = this.from.position;
		const toPos = this.to ? this.to.position : this.drawingPosition;
		const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
		const hypotenuse = Math.sqrt((fromPos.x - toPos.x) ** 2 + (fromPos.y - toPos.y) ** 2);

		context.translate(fromPos.x, fromPos.y);
		context.rotate(angle);

		if (this.selected) {
			context.strokeStyle = "blue";
			context.fillStyle = "blue";
		}

		// Line
		context.save();
		context.beginPath();
		context.lineWidth = 2.5;
		context.moveTo(this.from.r, 0);
		context.lineTo(hypotenuse - (this.to?.r || 0), 0);
		context.stroke();
		context.closePath();
		context.restore();

		// Arrow
		context.save();
		context.beginPath();
		context.lineTo(hypotenuse - this.size - (this.to?.r || 0), this.size);
		context.lineTo(hypotenuse - (this.to?.r || 0), 0);
		context.lineTo(hypotenuse - this.size - (this.to?.r || 0), -this.size);
		context.fill();
		context.closePath();
		context.restore();
	}

	public isInView(cameraPosition: Vector2D, cameraBounds: Vector2D): boolean {
		if (!this.to) return true;

		return this.from.isInView(cameraPosition, cameraBounds) || this.to.isInView(cameraPosition, cameraBounds);
	}

	public isMouseOver(position: Vector2D): boolean {
		if (!this.to) return false;

		const d1 = Math.sqrt((position.x - this.from.position.x) ** 2 + (position.y - this.from.position.y) ** 2);
		const d2 = Math.sqrt((this.to.position.x - position.x) ** 2 + (position.y - this.to.position.y) ** 2);

		const length = Math.sqrt(
			(this.to.position.x - this.from.position.x) ** 2 + (this.to.position.y - this.from.position.y) ** 2
		);

		return d1 + d2 >= length - 0.25 && d1 + d2 <= length + 0.25;
	}

	public onClick(clickGesture: ClickGesture) {
		this.selected = !this.selected;

		if (!clickGesture.alt) clickGesture.world.deselectAllClickables(this.id);
	}

	public onDoubleClick(clickGesture: ClickGesture) {
		// TODO
	}
}
