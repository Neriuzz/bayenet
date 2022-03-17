import IInteractable from "./IInteractable";

export default interface IDraggable extends IInteractable {
	readonly draggable: boolean;
	readonly dragging: boolean;
	onDragStart(): void;
	onDrag(): void;
	onDragEnd(): void;
};