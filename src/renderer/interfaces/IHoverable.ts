import Vector2D from "../Vector2D";

interface IHoverable {
	isMouseOver: (mousePosition: Vector2D, cameraPosition: Vector2D) => boolean
}

export default IHoverable;