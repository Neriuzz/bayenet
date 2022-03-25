import IClickable from "../interfaces/IClickable";

type KeyGesture = {
	key: string,
	ctrl: boolean,
	alt: boolean,
	shift: boolean
};

export default KeyGesture;