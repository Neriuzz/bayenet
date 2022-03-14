import Vector2D from "../Vector2D";
import IRenderable from "./IRenderable";

export default interface IInteractable extends IRenderable {
	zIndex: number;
	isMouseOver(cameraPosition: Vector2D, mousePositon: Vector2D): boolean;
};