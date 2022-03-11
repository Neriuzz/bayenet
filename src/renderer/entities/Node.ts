import IHoverable from "../interfaces/IHoverable";
import IClickable from "../interfaces/IClickable";
import Vector2D from "../Vector2D";

export default class Node implements IClickable {

	constructor(private _coords: Vector2D, private _r: number, private _id: number) {}

	public render(context: CanvasRenderingContext2D) {
		context.beginPath();
		context.arc(this._coords.x, this._coords.y, this._r, 0, Math.PI * 2);
		context.fillStyle = "red";
		context.fill();
	}

	public get id() {
		return this._id;
	}

	public isInView(cameraPosition: Vector2D, canvasBounds: Vector2D): boolean {
		return ( 
			(this._coords.x + this._r + cameraPosition.x >= 0 && this._coords.y + this._r + cameraPosition.y >= 0) && 
			(this._coords.x - this._r + cameraPosition.x < canvasBounds.x && this._coords.y - this._r + cameraPosition.y < canvasBounds.y)
		);
	}

	public isMouseOver(cameraPosition: Vector2D, mousePosition: Vector2D): boolean {
		return (
			(mousePosition.x - cameraPosition.x - this._coords.x) ** 2 + 
			(mousePosition.y - cameraPosition.y - this._coords.y) ** 2 <= this._r ** 2
		);
	}

	public onClick() {
		console.log(`Clicked on node ${this._id}`);
	}

	public onDoubleClick() {
		console.log(`Double-clicked on node ${this._id}`);
	}
}