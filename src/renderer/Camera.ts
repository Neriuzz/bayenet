import Vector2D from "./util/Vector2D";

export default class Camera {
    public position: Vector2D;
    public scaleFactor = 1;

    constructor(public readonly canvas: HTMLCanvasElement, public readonly context: CanvasRenderingContext2D) {
        this.position = new Vector2D(0, 0);
    }

    public clearScreen() {
        this.context.resetTransform();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(this.position.x, this.position.y);
    }

    public zoom() {
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(this.scaleFactor, this.scaleFactor);
        this.context.translate(-this.canvas.width / 2 + this.position.x, -this.canvas.height / 2 + this.position.y);
    }

    public get bounds(): Vector2D {
        return new Vector2D(this.canvas.width, this.canvas.height);
    }
}
