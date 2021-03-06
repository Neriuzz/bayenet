import EventBus, { CameraEvent } from "../shared/EventBus";
import Vector2D from "./util/Vector2D";

const eventBus = EventBus.instance;
export default class Camera {
    public position: Vector2D;
    public scaleFactor = 1;
    public scrollInverted = false;

    constructor(public readonly canvas: HTMLCanvasElement, public readonly context: CanvasRenderingContext2D) {
        this.position = new Vector2D(0, 0);

        // Register event handler for resetting zoom level
        eventBus.on(CameraEvent.RESET_ZOOM, () => this.resetZoom());
        eventBus.on(CameraEvent.INVERT_SCROLL, () => this.invertScroll());
    }

    // TODO: Smoothly reset the zoom if you have time in the future
    public resetZoom() {
        this.scaleFactor = 1;
    }

    public invertScroll() {
        this.scrollInverted = !this.scrollInverted;
    }

    public clearScreen() {
        this.context.resetTransform();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public zoom() {
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(this.scaleFactor, this.scaleFactor);
        this.context.translate(-this.canvas.width / 2 + this.position.x, -this.canvas.height / 2 + this.position.y);
    }

    public get bounds(): Vector2D {
        return new Vector2D(this.canvas.width / this.scaleFactor, this.canvas.height / this.scaleFactor);
    }

    public get transformedOrigin(): Vector2D {
        return new Vector2D(
            (this.canvas.width - this.canvas.width / this.scaleFactor) / 2,
            (this.canvas.height - this.canvas.height / this.scaleFactor) / 2
        );
    }
}
