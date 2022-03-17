import IInteractable from "./IInteractable";

export default interface IDraggable extends IInteractable {
	readonly draggable: boolean;
	readonly dragging: boolean;
	onDragStart(event: MouseEvent): void;
	onDrag(event: MouseEvent): void;
	onDragEnd(event: MouseEvent): void;
};