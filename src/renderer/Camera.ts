import Vector2 from "./Vector2";

export default class Camera {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	mouseDown: boolean = false;
	initialPosition: Vector2;
	currentPosition: Vector2;
	dragStartPosition: Vector2 | null = null;

	constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas;
		this.context = context;

		this.currentPosition = new Vector2(0, 0);
		this.initialPosition = new Vector2(0, 0);

		this.registerEventListeners();
	}

	registerEventListeners() {
		this.canvas.addEventListener("mousedown", (e: MouseEvent) => this.onMouseDown(e));
		this.canvas.addEventListener("mouseup", (e: MouseEvent) => this.onMouseUp(e));
		this.canvas.addEventListener("mousemove", (e: MouseEvent) => this.onMouseMove(e));
	}

	onMouseDown(e: MouseEvent) {
		e.preventDefault();
		this.mouseDown = true;
		this.dragStartPosition = new Vector2(e.clientX, e.clientY);
		this.initialPosition = new Vector2(this.currentPosition.x, this.currentPosition.y);
		console.log("aids");
	}

	onMouseUp(e: MouseEvent) {
		e.preventDefault();
		this.mouseDown = false;
		this.dragStartPosition = null;
		console.log("asdasd");
	}
	
	onMouseMove(e: MouseEvent) {
		e.preventDefault();
		if (!this.mouseDown)
			return;
		let deltaPosition = new Vector2(e.clientX - this.dragStartPosition!.x, e.clientY - this.dragStartPosition!.y);
		this.context.translate(-this.currentPosition.x, -this.currentPosition.y);
		this.currentPosition = new Vector2(this.initialPosition.x + deltaPosition.x, this.initialPosition.y + deltaPosition.y);
		this.context.translate(this.currentPosition.x, this.currentPosition.y);
		console.log(deltaPosition.x, deltaPosition.y);
	}
}
