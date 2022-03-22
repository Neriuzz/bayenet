import Vector2D from "../util/Vector2D";
import IEntity from "./IEntity";

export default interface IInteractable extends IEntity {
	isMouseOver(cameraPosition: Vector2D, mousePositon: Vector2D): boolean;
};