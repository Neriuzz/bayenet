import IClickable from "../interfaces/IClickable";

type KeyGesture = {
	key: string,
	selected: IClickable[],
};

export default KeyGesture;