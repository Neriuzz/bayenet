import Camera from "./Camera";
import World from "./World";
import InputHandler from "./InputHandler";

export default class Renderer {
	private _camera: Camera;
	private _world: World;
	private _inputHandler: InputHandler;

	private _frameCount: number = 0;
	private _animationFrameID: number = 0;

	constructor(private _canvas: HTMLCanvasElement, private _context: CanvasRenderingContext2D) {
		// Initialise camera
		this._camera = new Camera(this._canvas, this._context);

		// Initialise world
		this._world = new World(this._camera);

		// Initialise input handler
		this._inputHandler = new InputHandler(this._canvas, this._world);
			
		// Begin the render loop
		this.renderLoop();
	}

	public draw() {
		this._camera.clearScreen();
		this._world.renderablesInView.forEach(renderable => {
			renderable.render(this._context);
		});
	}

	public renderLoop() {
		this._frameCount++;
		this.draw();
		this._animationFrameID = requestAnimationFrame(() => this.renderLoop());
	}

	public cancelDraw() {
		cancelAnimationFrame(this._animationFrameID!);
	}
}
