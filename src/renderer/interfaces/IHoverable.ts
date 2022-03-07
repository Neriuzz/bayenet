import Vector2D from "../Vector2D";

export default interface IHoverable {
	isMouseOver: (mousePosition: Vector2D, cameraPosition: Vector2D) => boolean
}