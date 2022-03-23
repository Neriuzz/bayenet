import Vector2D from "../util/Vector2D"
import World from "../World";

type DragGesture = {
	position: Vector2D,
	zIndex?: number
};

export default DragGesture;