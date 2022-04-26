import Vector2D from "../util/Vector2D";
import IEntity from "./IEntity";

export default interface IInteractable extends IEntity {
	isMouseOver(position: Vector2D): boolean;
}
