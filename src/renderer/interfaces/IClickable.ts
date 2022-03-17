import IInteractable from "./IInteractable";

export default interface IClickable extends IInteractable {
	readonly clickable: boolean;
	readonly selected: boolean;
	onClick(): void;
	onDoubleClick(): void;
};