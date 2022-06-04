// Interfaces
import IClickable from "../interfaces/IClickable";
import IDoubleClickable from "../interfaces/IDoubleClickable";
import IDraggable from "../interfaces/IDraggable";
import IHoverable from "../interfaces/IHoverable";
import IRenderable from "../interfaces/IRenderable";

function isRenderable(object: unknown): object is IRenderable {
    const renderable = object as IRenderable;
    return renderable.id !== undefined && renderable.isInView !== undefined && renderable.render !== undefined;
}

function isClickable(object: unknown): object is IClickable {
    const clickable = object as IClickable;
    return clickable.selected !== undefined && clickable.onClick !== undefined;
}

function isDoubleClickable(object: unknown): object is IDoubleClickable {
    const doubleClickable = object as IDoubleClickable;
    return doubleClickable.onDoubleClick !== undefined;
}

function isDraggable(object: unknown): object is IDraggable {
    const draggable = object as IDraggable;
    return (
        draggable.dragging !== undefined &&
        draggable.onDrag !== undefined &&
        draggable.onDragEnd !== undefined &&
        draggable.onDragStart !== undefined
    );
}

function isHoverable(object: unknown): object is IHoverable {
    const hoverable = object as IHoverable;
    return (
        hoverable.hovering !== undefined &&
        hoverable.onHovering !== undefined &&
        hoverable.onEnterHover !== undefined &&
        hoverable.onExitHover !== undefined
    );
}

export { isRenderable, isClickable, isDoubleClickable, isDraggable, isHoverable };
