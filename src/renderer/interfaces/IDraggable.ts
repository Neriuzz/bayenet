import { DragGesture } from "../gestures";
import IInteractable from "./IInteractable";

export default interface IDraggable extends IInteractable {
    dragging: boolean;
    onDragStart(dragGesture: DragGesture): void;
    onDrag(dragGesture: DragGesture): void;
    onDragEnd(dragGesture: DragGesture): void;
}
