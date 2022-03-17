import DraggableEntity from "./entities/DraggableEntity";
import Vector2D from "./util/Vector2D";

export default class Camera extends DraggableEntity {

	constructor(private _canvas: HTMLCanvasElement, private _context: CanvasRenderingContext2D) {
		super(new Vector2D(0, 0));
	}

	public clearScreen() {
		this._context.setTransform(1, 0, 0, 1, 0, 0);
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._context.translate(this._currentPosition.x, this._currentPosition.y);
	}

	public get canvasBounds(): Vector2D {
		return new Vector2D(this._canvas.width, this._canvas.height);
	}
}
