import DraggableEntity from "./entities/DraggableEntity";
import Vector2D from "./util/Vector2D";

export default class Camera {

	private _currentPosition: Vector2D;

	constructor(private _canvas: HTMLCanvasElement, private _context: CanvasRenderingContext2D) {
		this._currentPosition = new Vector2D(0, 0);		
	}

	public get currentPosition() {
		return this._currentPosition;
	}

	public set currentPosition(newPosition: Vector2D) {
		this._currentPosition = newPosition;
	}

	public clearScreen() {
		this._context.setTransform(1, 0, 0, 1, 0, 0);
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._context.translate(this._currentPosition.x, this._currentPosition.y);
	}

	public get canvasBounds(): Vector2D {
		return new Vector2D(this._canvas.width, this._canvas.height);
	}
};
