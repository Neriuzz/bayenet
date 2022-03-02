import World from "./World";

export default class InputHandler {
	canvas: HTMLCanvasElement;
	world: World;

	constructor(canvas: HTMLCanvasElement, world: World) {
		this.canvas = canvas;
		this.world = world;
	}

	private resize() {
		// Scale and resize the canvas appropriately based on device width, height and pixel ratio
		this.canvas.width = window.innerWidth * window.devicePixelRatio;
		this.canvas.height = window.innerHeight * window.devicePixelRatio;
		this.canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
	}
}