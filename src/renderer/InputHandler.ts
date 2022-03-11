import World from "./World";
import Vector2D from "./Vector2D";

export default class InputHandler {
	constructor(private _canvas: HTMLCanvasElement, private _world: World) {

		// Register window event listeners
		window.addEventListener("resize", () => this.onResize());

		// Register canvas event listeners
		this._canvas.addEventListener("mousedown", (event: MouseEvent) => this.onMouseDown(event));
		this._canvas.addEventListener("mouseup", (event: MouseEvent) => this.onMouseUp(event));
		this._canvas.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
		this._canvas.addEventListener("dblclick", (event: MouseEvent) => this.onDoubleClick(event));

		// Initial canvas resize
		this.onResize();
	}

	private onDoubleClick(event: MouseEvent) {
		event.preventDefault();
		let coords = new Vector2D(event.clientX - this._world.camera.currentPosition.x, event.clientY - this._world.camera.currentPosition.y)
		this._world.createNode(coords);
	}

	private onMouseDown(event: MouseEvent) {
		event.preventDefault();
	}

	private onMouseUp(event: MouseEvent) {
		event.preventDefault();
	}

	private onMouseMove(event: MouseEvent) {
		event.preventDefault();
	}

	private onResize() {
		// Scale and resize the canvas appropriately based on device width, height and pixel ratio
		this._canvas.width = window.innerWidth * window.devicePixelRatio;
		this._canvas.height = window.innerHeight * window.devicePixelRatio;
		this._canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
	}

}