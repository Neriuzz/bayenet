import World from "./World";
import Vector2D from "./util/Vector2D";

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

		let mousePosition = new Vector2D(event.clientX, event.clientY)

		let clickable = this._world.clickablesInView
			.filter(clickable => clickable.isMouseOver(this._world.camera.currentPosition, mousePosition))
			.sort(clickable => clickable.zIndex)
			.reverse()[0];

		if (!clickable)
			return;

		clickable.onClick()
	}

	private onDoubleClick(event: MouseEvent) {
		event.preventDefault();

		let mousePosition = new Vector2D(event.clientX, event.clientY)

		let clickable = this._world.clickablesInView
			.filter(clickable => clickable.isMouseOver(this._world.camera.currentPosition, mousePosition))
			.sort(clickable => clickable.zIndex)
			.reverse()[0];

		if (!clickable) {
			this._world.createNode(new Vector2D(event.clientX - this._world.camera.currentPosition.x, event.clientY - this._world.camera.currentPosition.y));
			return;
		}
	
		clickable.onDoubleClick();
	}

	private onMouseDown(event: MouseEvent) {
		event.preventDefault();

		let mousePosition = new Vector2D(event.clientX, event.clientY)

		let draggable = this._world.draggablesInView
			.filter(draggable => draggable.isMouseOver(this._world.camera.currentPosition, mousePosition))
			.sort(draggable => draggable.zIndex)
			.reverse()[0];

		draggable ? draggable.onDragStart(event) : this._world.camera.onDragStart(event);
	}

	private onMouseUp(event: MouseEvent) {
		event.preventDefault();

		if (this._world.camera.dragging) {
			this._world.camera.onDragEnd(event);
			return;
		}

		let draggable = this._world.draggablesInView.find(draggable => draggable.dragging);

		draggable?.onDragEnd(event)
	}

	private onMouseMove(event: MouseEvent) {
		event.preventDefault();

		if (this._world.camera.dragging) {
			this._world.camera.onDrag(event);
			return;
		}

		let draggable = this._world.draggablesInView.find(draggable => draggable.dragging);

		draggable?.onDrag(event)
	}

	private onResize() {
		// Scale and resize the canvas appropriately based on device width, height and pixel ratio
		this._canvas.width = window.innerWidth * window.devicePixelRatio;
		this._canvas.height = window.innerHeight * window.devicePixelRatio;
		this._canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
	}

}