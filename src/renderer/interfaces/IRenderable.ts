import Vector2D from "../Vector2D";

export default interface IRenderable {
	readonly id: number;
	render(context: CanvasRenderingContext2D): void;
	isInView(cameraPosition: Vector2D, cameraBounds: Vector2D): boolean;
};

