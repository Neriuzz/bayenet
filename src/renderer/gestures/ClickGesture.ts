import IClickable from "../interfaces/IClickable";
import Vector2D from "../util/Vector2D";

type ClickGesture = {
	position: Vector2D,
	offset: Vector2D,
	selected?: IClickable[],
	altPressed?: boolean
};

export default ClickGesture;