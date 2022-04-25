import Board from "./entities/Board";
import InputHandler from "./InputHandler";
import World from "./World";

export default class Renderer {
	private frameCount = 0;
	private animationFrameID = 0;

	private world: World;
	private board: Board;

	constructor(private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D) {
		// Initialise board
		this.board = new Board(this.canvas, this.context);

		// Initialise world
		this.world = new World(this.board);

		// Initialise input handler
		new InputHandler(this.world);
			
		// Begin the render loop
		this.renderLoop();
	}

	public draw() {
		// Clear the bitmap
		this.board.camera.clearScreen();

		// Sort renderables by increasing z-index
		const renderables = this.world.renderablesInView.sort((a, b) => a.zIndex - b.zIndex);
		
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
