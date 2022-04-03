import Camera from "./Camera";
import World from "./World";
import InputHandler from "./InputHandler";
import WorldState from "./WorldState";

export default class Renderer {
	private camera: Camera;
	private world: World;
	private inputHandler: InputHandler;

	private frameCount: number = 0;
	private animationFrameID: number = 0;

	constructor(private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D) {
		// Initialise camera
		this.camera = new Camera(this.canvas, this.context);

		// Initialise world
		this.world = new World(this.camera);
		WorldState.instance.registerWorld(this.world);

		// Initialise input handler
		this.inputHandler = new InputHandler();
			
		// Begin the render loop
		this.renderLoop();
	}

	public draw() {
		// Clear the bitmap
		this.camera.clearScreen();

		// Sort renderables by increasing z-index
		let renderables = this.world.renderablesInView.sort((a, b) => a.zIndex - b.zIndex);
		
		// Render out each renderable
		renderables.forEach(renderable => {
			this.context.save();
			renderable.render(this.context);
			this.context.restore();
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
};
