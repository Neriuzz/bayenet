import { ClickGesture } from "../gestures";
import IInteractable from "./IInteractable";

export default interface IClickable extends IInteractable {
    selected: boolean;
    onClick(clickGesture: ClickGesture): void;
}
