import World from "./World";
import Vector2D from "./Vector2D";
import IClickable from "./interfaces/IClickable";
import IHoverable from "./interfaces/IHoverable";

export default class InputHandler {
	constructor(private _canvas: HTMLCanvasElement, private _world: World) {

		// Register window event listeners
		window.addEventListener("resize", () => this.onResize());

		// Register canvas event listeners
		this._canvas.addEventListener("mousedown", (event: MouseEvent) => this.onMouseDown(event));
		this._canvas.addEventListener("mouseup", (event: MouseEvent) => this.onMouseUp(event));
		this._canvas.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
		this._canvas.addEventListener("click", (event: MouseEvent) => this.onClick(event));
		this._canvas.addEventListener("dblclick", (event: MouseEvent) => this.onDoubleClick(event));

		// Initial canvas resize
		this.onResize();
	}

	private onClick(event: MouseEvent) {
		event.preventDefault();

		// Retrieve all clickable renderables on screen
		let clickables = this._world.renderablesInView as IClickable[];
		
		let clickable = clickables
			.sort(clickable => clickable.zIndex)
			.reverse()
			.filter(clickable => clickable.isMouseOver(this._world.camera.currentPosition, this._world.camera.mousePosition))[0];

		// If we aren't cicking on a clickable renderable, then we must be clicking on the canvas
		if (!clickable)
			return;

		clickable.onClick()
	}

	private onDoubleClick(event: MouseEvent) {
		event.preventDefault();

		let clickables = this._world.renderablesInView as IClickable[];

		let clickable = clickables
			.sort(clickable => clickable.zIndex)
			.reverse()
			.filter(clickable => clickable.isMouseOver(this._world.camera.currentPosition, this._world.camera.mousePosition))[0];

		if (!clickable) {
			this._world.createNode(new Vector2D(event.clientX - this._world.camera.currentPosition.x, event.clientY - this._world.camera.currentPosition.y));
			return;
		}

		clickable.onDoubleClick();
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