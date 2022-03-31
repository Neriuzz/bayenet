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

	public zIndex = 1;
	public type = EntityType.EDGE;

	private state = WorldState.instance;

	constructor(public id: number, public from: Node, public to?: Node) {}

	public render(context: CanvasRenderingContext2D) {
		let fromPos = new Vector2D(this.from.position.x - this.from.r, this.from.position.y);
		let toPos = this.to ? new Vector2D(this.to.position.x - this.to.r, this.to.position.y) : this.state.mousePosition;
		let angle = Math.atan2((toPos.y - fromPos.y), (toPos.x - fromPos.x));
		let hypotenuse = Math.sqrt((fromPos.x- toPos.x) ** 2 + (fromPos.y - toPos.y) ** 2);

		context.translate(fromPos.x, fromPos.y);
		context.rotate(angle);

		// Line
		context.beginPath();
		context.lineWidth = 2;
		context.moveTo(0, 0);
		context.lineTo(hypotenuse, 0);
		context.stroke();
		context.closePath();

		// Arrow
		context.beginPath();
		context.lineTo(hypotenuse - 10, 10);
		context.lineTo(hypotenuse, 0);
		context.lineTo(hypotenuse - 10, -10);
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