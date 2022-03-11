import Camera from "./Camera";
import World from "./World";
import InputHandler from "./InputHandler";

export default class Renderer {

	private camera: Camera;
	private world: World;
	private inputHandler: InputHandler;

	private frameCount: number;
	private animationFrameID: number | null;

	constructor(private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D) {

		this.frameCount = 0;
		this.animationFrameID = null;
		
		// Initialise camera
		this.camera = new Camera(this.canvas, this.context);

		// Initialise world
		this.world = new World(this.camera);

		// Initialise input handler
		this.inputHandler = new InputHandler(this.canvas, this.world);
			
		this.renderLoop();
	}

	public draw() {
		this.camera.clearScreen();
		let renderables = this.world.renderablesInView;
		renderables.forEach(renderable => {
			renderable.render(this.context);
		});
	}

	public renderLoop() {
		this.frameCount++;
		this.draw();
		this.animationFrameID = requestAnimationFrame(() => this.renderLoop());
	}

	public cancelDraw() {
		cancelAnimationFrame(this.animationFrameID!);
	}

}
