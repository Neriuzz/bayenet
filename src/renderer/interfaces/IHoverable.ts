import IRenderable from "./IRenderable";

export default interface IHoverable extends IRenderable {
	onEnterHover(): void;
	onHovering(): void;
	onExitHover(): void;
};