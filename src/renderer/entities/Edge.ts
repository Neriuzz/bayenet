import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";

export default class Edge implements IRenderable {
	public zIndex = 1;

	constructor(public id: number, private fromNode: Node | null, private toNode: Node | null = null) {}

	public render(context: CanvasRenderingContext2D) { }

	public isInView(cameraPosition: Vector2D, cameraBounds: Vector2D): boolean {
		return true;
	}

}