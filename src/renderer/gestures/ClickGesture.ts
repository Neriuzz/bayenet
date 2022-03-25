import Edge from "../entities/Edge";
import IClickable from "../interfaces/IClickable";
import Vector2D from "../util/Vector2D";

type ClickGesture = {
	position: Vector2D,
	alt: boolean,
	shift: boolean,
	edge?: Edge,
	selected?: IClickable[]
};

export default ClickGesture;