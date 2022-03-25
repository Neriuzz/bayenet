import IInteractable from "./IInteractable";

export default interface IHoverable extends IInteractable {
	readonly hoverable: boolean;
	
	readonly hovering: boolean;
	onEnterHover(): void;
	onHovering(): void;
	onExitHover(): void;
};