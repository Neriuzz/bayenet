import IInteractable from "./IInteractable";

export default interface IDraggable extends IInteractable {
	onDragStart(): void;
	onDrag(): void;
	onDragEnd(): void;
};