import Camera from "../Camera";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../Vector2D";

export default class Node implements IRenderable {

	private coords: Vector2D;
	private r: number;

	constructor(coords: Vector2D, r: number) {
		this.coords = coords;
		this.r = r;
	}

	public render(context: CanvasRenderingContext2D) {
		context.beginPath();
		context.arc(this.coords.x, this.coords.y, this.r, 0, Math.PI * 2);
		context.fillStyle = "red";
		context.fill();
	}

	public isInView(camera: Camera): boolean {
		let cameraPosition = camera.getCurrentPosition();
		let canvas = camera.getCanvas();
		if (
			(this.coords.x + this.r + cameraPosition.x >= 0 && this.coords.y + this.r + cameraPosition.y >= 0) &&
			(this.coords.x - this.r + cameraPosition.x < canvas.width && this.coords.y - this.r + cameraPosition.y < canvas.height)
		) 
			return true;
		return false;
	}
}