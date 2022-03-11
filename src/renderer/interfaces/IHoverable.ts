import IRenderable from "./IRenderable";

export default interface IHoverable extends IRenderable {
	readonly hovering: boolean;
	onEnterHover(): void;
	onHovering(): void;
	onExitHover(): void;
};