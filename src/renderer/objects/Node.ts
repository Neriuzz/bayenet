import IRenderable from "../interfaces/IRenderable";
import IHoverable from "../interfaces/IHoverable";
import Vector2D from "../Vector2D";

export default class Node implements IRenderable, IHoverable {

	private id: number | null;

	constructor(private coords: Vector2D, private r: number) {
		this.id = null;
	}

	public render(context: CanvasRenderingContext2D) {
		context.beginPath();
		context.arc(this.coords.x, this.coords.y, this.r, 0, Math.PI * 2);
		context.fillStyle = "red";
		context.fill();
	}

	public setID(id: number) {
		this.id = id;
	}

	public getID() {
		return this.id!;
	}

	public isInView(canvasBounds: Vector2D, cameraPosition: Vector2D): boolean {
		if (
			(this.coords.x + this.r + cameraPosition.x >= 0 && this.coords.y + this.r + cameraPosition.y >= 0) &&
			(this.coords.x - this.r + cameraPosition.x < canvasBounds.x && this.coords.y - this.r + cameraPosition.y < canvasBounds.y)
		) 
			return true;
		return false;
	}

	public isMouseOver(mousePosition: Vector2D): boolean {
		if ((mousePosition.x - this.coords.x) * (mousePosition.x - this.coords.x) + (mousePosition.y - this.coords.y) * (mousePosition.y - this.coords.y) <= this.r * this.r)
			return true;
		return false;
	}
}