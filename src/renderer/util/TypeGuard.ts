// Interfaces
import IClickable from "../interfaces/IClickable";
import IDraggable from "../interfaces/IDraggable";
import IHoverable from "../interfaces/IHoverable";
import IRenderable from "../interfaces/IRenderable";

function isRenderable(object: any): object is IRenderable {
	return 'renderable' in object;
}

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
	isRenderable,
	isClickable,
	isDraggable,
	isHoverable
};