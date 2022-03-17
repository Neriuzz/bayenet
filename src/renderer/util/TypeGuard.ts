// Interfaces
import IClickable from "../interfaces/IClickable";
import IDraggable from "../interfaces/IDraggable";
import IHoverable from "../interfaces/IHoverable";

function isClickable(object: any): object is IClickable {
	return 'clickable' in object;
}

function isDraggable(object: any): object is IDraggable {
	return 'draggable' in object;
}

function isHoverable(object: any): object is IHoverable {
	return 'hoverable' in object;
}

export {
	isClickable,
	isDraggable,
	isHoverable
};