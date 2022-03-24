import ClickGesture from "../gestures/ClickGesture";
import DragGesture from "../gestures/DragGesture";
import KeyGesture from "../gestures/KeyGesture";
import IClickable from "../interfaces/IClickable";
import IDraggable from "../interfaces/IDraggable";
import Vector2D from "../util/Vector2D";
import World from "../World";
import DraggableEntity from "./DraggableEntity";
import Node from "./Node";

export default class Board extends DraggableEntity implements IClickable {
	public clickable = true;
	public zIndex = 0;

	constructor (private world: World) {
		super(-1, new Vector2D(0, 0));
	}

	public onClick(clickGesture: ClickGesture) {
		clickGesture.selected?.forEach(clickable => clickable.selected = false);
	}
	
	public onDoubleClick(clickGesture: ClickGesture) {
		let coords = new Vector2D(clickGesture.position.x, clickGesture.position.y);
		this.world.createNode(coords);
	}

	public onDrag(dragGesture: DragGesture) {
		super.onDrag(dragGesture);
		this.world.camera.position = this.currentPosition;
	}

	public isMouseOver(position: Vector2D): boolean { return true }

	public onKeyDown(keyGesture: KeyGesture) {
		if (keyGesture.key == "Delete")
			keyGesture.selected.forEach(clickable => this.world.deleteNode(clickable as Node));
	}
}