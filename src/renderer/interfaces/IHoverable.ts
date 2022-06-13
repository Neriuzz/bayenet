import { HoverGesture } from "../gestures";
import IInteractable from "./IInteractable";

export default interface IHoverable extends IInteractable {
    hovering: boolean;
    onEnterHover(hoverGesture: HoverGesture): void;
    onExitHover(hoverGesture: HoverGesture): void;
}
