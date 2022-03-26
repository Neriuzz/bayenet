import EntityType from "../EntityType";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";
import Node from "./Node";

export default class Edge implements IRenderable {
	public renderable = true;

	public zIndex = 1;
	public type = EntityType.EDGE;

	public toNode: Node | null = null;

	constructor(public id: number, public fromNode: Node, public position: Vector2D) {}

	public render(context: CanvasRenderingContext2D) {
		context.beginPath();
		context.moveTo(this.fromNode.position.x + this.fromNode.r, this.fromNode.position.y);
		if (this.toNode) {
			context.lineTo(this.toNode.position.x - this.toNode.r, this.toNode.position.y);
		} else {
			context.lineTo(this.position.x, this.position.y);
		}
		context.stroke();
	 }

	public isInView(cameraPosition: Vector2D, cameraBounds: Vector2D): boolean {
		return true;
	}
}