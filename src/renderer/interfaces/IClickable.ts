import IInteractable from "./IInteractable";

export default interface IClickable extends IInteractable {
	readonly clickable: boolean;
	readonly clicked: boolean;
	onClick(): void;
	onDoubleClick(): void;
};