import Board from "./entities/Board";
import InputHandler from "./InputHandler";
import State from "./State";
import World from "./World";

import WorldData from "../shared/WorldData";
import EventBus from "../shared/EventBus";
const worldData = WorldData.instance;
const eventBus = EventBus.instance;

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

        // Register world to WorldData
        worldData.registerWorld(this.world);

        // Initialise input handler
        new InputHandler(this.world);

        // Attempt to load previous session
        State.loadPreviousWorldState(this.world);

        // Register saveState event listener
        eventBus.on("saveState", () => this.saveWorldState());

        // Begin the render loop
        this.renderLoop();
    }

    public draw() {
        // Clear the bitmap
        this.board.camera.clearScreen();

        // Handle zooming
        this.board.camera.zoom();

        // Sort renderables by increasing z-index
        const renderables = this.world.renderablesInView.sort((a, b) => a.zIndex - b.zIndex);

        // Render out each renderable
        renderables.forEach((renderable) => {
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
        cancelAnimationFrame(this.animationFrameID);
    }

    private saveWorldState() {
        State.saveCurrentWorldState(this.world);
    }
}
