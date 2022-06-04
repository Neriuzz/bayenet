import { ClickGesture } from "../gestures";
import IInteractable from "./IInteractable";

export default interface IDoubleClickable extends IInteractable {
    onDoubleClick(clickGesture: ClickGesture): void;
}
