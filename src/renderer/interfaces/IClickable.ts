import IRenderable from "./IRenderable";

export default interface IClickable extends IRenderable {
	onClick(): void;
};