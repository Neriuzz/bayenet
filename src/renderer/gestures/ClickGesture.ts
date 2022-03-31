import IClickable from "../interfaces/IClickable";
import Vector2D from "../util/Vector2D";
import World from "../World";

type ClickGesture = {
	position: Vector2D,
	alt: boolean,
	shift: boolean,
	world?: World
};

export default ClickGesture;