import { ClickGesture } from "../gestures";
import IInteractable from "./IInteractable";

export default interface IClickable extends IInteractable {
    readonly clickable: boolean;

    selected: boolean;
    onClick(clickGesture: ClickGesture): void;
    onDoubleClick(clickGesture: ClickGesture): void;
}
