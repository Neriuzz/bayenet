import Vector2D from "../util/Vector2D";

export default interface IInteractable {
	zIndex: number;
	isMouseOver(cameraPosition?: Vector2D, mousePositon?: Vector2D): boolean;
};