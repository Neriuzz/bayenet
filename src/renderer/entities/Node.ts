import IClickable from "../interfaces/IClickable";
import IDraggable from "../interfaces/IDraggable";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";

export default class Node implements IRenderable, IClickable, IDraggable {
	public clickable = true;
	public draggable = true;

	public dragging = false;
	public clicked = false;
	public zIndex = 1;

	constructor(public id: number, private _coords: Vector2D, private _r: number) {}

	public render(context: CanvasRenderingContext2D) {
		context.beginPath();
		context.arc(this._coords.x, this._coords.y, this._r, 0, Math.PI * 2);
		context.fillStyle = "red";
		if (this.clicked) {
			context.strokeStyle = "blue";
			context.lineWidth = 5;
			context.stroke();
		}
 		context.fill();
	}

	public get radius() {
		return this._r;
	}

	public get coords() {
		return this._coords;
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
		this.clicked = !this.clicked;
		console.log(`Clicked on node ${this.id}`);
	}

	public onDoubleClick() {
		console.log(`Double-clicked on node ${this.id}`);
	}

	public onDragStart() {}
	public onDrag() {}
	public onDragEnd() {}
}