import IClickable from "../interfaces/IClickable";
import World from "../World";

type KeyGesture = {
	key: string,
	ctrl: boolean,
	alt: boolean,
	shift: boolean,
	world: World
};

export default KeyGesture;