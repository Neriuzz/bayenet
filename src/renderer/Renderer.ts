import Camera from "./Camera";

export default class Renderer {

	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	camera: Camera;

	constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
		this.canvas = canvas;
		this.context = context;
		this.resize();
		this.drawCircle();

		this.camera = new Camera(this.canvas, this.context);

		window.addEventListener("resize", () => this.resize());
	}

	drawCircle() {
		console.log("xd");
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.beginPath();
		this.context.fillStyle = "red";
 		this.context.arc(this.canvas.width / 2 - (50 / 2), this.canvas.height / 2 - (50 / 2), 50, 0, Math.PI * 2);
		this.context.fill();
		window.requestAnimationFrame(() => this.drawCircle());
	}

	resize() {
		this.canvas.width = window.innerWidth * window.devicePixelRatio;
		this.canvas.height = window.innerHeight * window.devicePixelRatio;
		this.canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
	}

}
