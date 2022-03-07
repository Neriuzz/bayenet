import Camera from "./Camera";
import InputHandler from "./InputHandler";
import Node from "./entities/Node";
import Vector2D from "./Vector2D";
import World from "./World";

export default class Renderer {

	private camera: Camera;
	private world: World;
	// inputHandler: InputHandler;

	private frameCount: number;
	private animationFrameID: number | null;

	private nextID: number = 0;

	constructor(private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D) {

		this.frameCount = 0;
		this.animationFrameID = null;
		
		// Create new camera
		this.camera = new Camera(this.canvas, this.context);

		// Create new world
		this.world = new World(this.camera);

		// Create event handler
		// this.inputHandler = new InputHandler(this.canvas, this.world);
		
		// Initial resize and subsequent resizes on window size change
		this.resize();
		window.addEventListener("resize", () => this.resize());

		this.canvas.addEventListener("dblclick", (e: MouseEvent) => this.onDoubleClick(e));
		window.addEventListener("keydown", (e: KeyboardEvent) => this.onKeyDown(e));
	
		this.renderLoop();
	}

	private resize() {
		// Scale and resize the canvas appropriately based on device width, height and pixel ratio
		this.canvas.width = window.innerWidth * window.devicePixelRatio;
		this.canvas.height = window.innerHeight * window.devicePixelRatio;
		this.canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
	}

	private onDoubleClick(e: MouseEvent) {
		e.preventDefault();
		let offset = this.camera.getCurrentPosition();
		this.createNode(new Vector2D(e.clientX - offset.x, e.clientY - offset.y));
	}

	private onKeyDown(e: KeyboardEvent) {
		if (e.key == "Delete") {
			this.deleteMousedOverNode();
		}
	}

	private deleteMousedOverNode() {
		let entity = this.world.mousedOverEntity;
		if (!entity)
			return;
		
		this.world.removeEntity(entity);
	}

	private createNode(coords: Vector2D) {
		let node = new Node(coords, 20, this.nextID++);
		this.world.addEntity(node);
	}

	public draw() {
		this.camera.clearScreen();
		let entities = this.world.entitiesInView;
		entities.forEach(entity => {
			entity.render(this.context);
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
