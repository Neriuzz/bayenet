import IRenderable from "./IRenderable";

export default interface IDraggable extends IRenderable {
	onDragStart(): void;
	onDrag(): void;
	onDragEnd(): void;
};