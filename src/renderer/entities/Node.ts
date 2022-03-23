import ClickGesture from "../gestures/ClickGesture";
import DragGesture from "../gestures/DragGesture";
import IClickable from "../interfaces/IClickable";
import IDraggable from "../interfaces/IDraggable";
import IRenderable from "../interfaces/IRenderable";
import Vector2D from "../util/Vector2D";
import DraggableEntity from "./DraggableEntity";

export default class Node extends DraggableEntity implements IRenderable, IClickable {
	public clickable = true;
	public selected = false;

	constructor(public id: number, _currentPosition: Vector2D, private _r: number) {
		super(id, _currentPosition);
	}

	public render(context: CanvasRenderingContext2D) {
		context.save();
		context.beginPath();
		context.arc(this._currentPosition.x, this._currentPosition.y, this._r, 0, Math.PI * 2);
		context.fillStyle = "red";
		if (this.selected) {
			context.globalAlpha = 0.5;
			context.strokeStyle = "blue";
			context.lineWidth = 6;
			context.stroke();
			context.globalAlpha = 1;
		}
 		context.fill();
		context.restore();
	}

	public isInView(cameraPosition: Vector2D, canvasBounds: Vector2D): boolean {
		return ( 
			(this._currentPosition.x + this._r + cameraPosition.x >= 0 && this._currentPosition.y + this._r + cameraPosition.y >= 0) && 
			(this._currentPosition.x - this._r + cameraPosition.x < canvasBounds.x && this._currentPosition.y - this._r + cameraPosition.y < canvasBounds.y)
		);
	}

	public isMouseOver(cameraPosition: Vector2D, mousePosition: Vector2D): boolean {
		return (
			(mousePosition.x - cameraPosition.x - this._currentPosition.x) ** 2 + 
			(mousePosition.y - cameraPosition.y - this._currentPosition.y) ** 2 <= this._r ** 2
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
};