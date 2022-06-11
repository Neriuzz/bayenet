import Vector2D from "../util/Vector2D";
import IEntity from "./IEntity";

export default interface IRenderable extends IEntity {
    readonly id: number;
    render(context: CanvasRenderingContext2D): void;
    isInView(cameraPosition: Vector2D, cameraBounds: Vector2D, transformedOrigin: Vector2D): boolean;
}
