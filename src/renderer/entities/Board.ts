import ClickGesture from "../gestures/ClickGesture";
import KeyGesture from "../gestures/KeyGesture";
import IClickable from "../interfaces/IClickable";
import IDraggable from "../interfaces/IDraggable";
import Vector2D from "../util/Vector2D";
import World from "../World";
import Node from "./Node";

export default class Board implements IClickable, IDraggable {
	constructor (private world: World) {}

	public onClick(clickGesture: ClickGesture) {
		clickGesture.selected?.forEach(clickable => clickable.selected = false);
	}
	
	public onDoubleClick(clickGesture: ClickGesture) {
		console.log(clickGesture);
		let coords = new Vector2D(clickGesture.position.x - clickGesture.offset.x, clickGesture.position.y - clickGesture.offset.y);
		this.world.createNode(coords);
	}

	public onDragStart(event: MouseEvent) {
		this.world.camera.onDragStart(event);
	}

	public onDrag(event: MouseEvent) {
		this.world.camera.onDrag(event);
	}

	public onDragEnd(event: MouseEvent) {
		this.world.camera.onDragEnd(event);
	}

	public onKeyDown(keyGesture: KeyGesture) {
		if (keyGesture.key == "Delete")
			keyGesture.selected.forEach(clickable => this.world.deleteNode(clickable as Node));
	}
}