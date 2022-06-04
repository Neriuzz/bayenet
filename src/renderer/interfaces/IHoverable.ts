import IInteractable from "./IInteractable";

export default interface IHoverable extends IInteractable {
    hovering: boolean;
    onEnterHover(): void;
    onHovering(): void;
    onExitHover(): void;
}
