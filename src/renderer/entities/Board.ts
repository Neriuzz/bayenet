import EntityType from "../EntityType";
import ClickGesture from "../gestures/ClickGesture";
import DragGesture from "../gestures/DragGesture";
import KeyGesture from "../gestures/KeyGesture";
import IClickable from "../interfaces/IClickable";
import Vector2D from "../util/Vector2D";
import World from "../World";
import DraggableEntity from "./DraggableEntity";

export default class Board extends DraggableEntity implements IClickable {
	public clickable = true;
	public zIndex = 0;

	constructor (private world: World) {
		super(-1, EntityType.BOARD, new Vector2D(0, 0));
	}

	public onClick(clickGesture: ClickGesture) {
		this.state.clearClickables();
	}
	
	public onDoubleClick(clickGesture: ClickGesture) {
		this.world.createNode(clickGesture.position);
	}

	public onDrag(dragGesture: DragGesture) {
		super.onDrag(dragGesture);
		this.world.camera.position = this.currentPosition;
	}

	public isMouseOver(position: Vector2D): boolean { return true }

	public onKeyDown(keyGesture: KeyGesture) {
		if (keyGesture.key == "Delete") {
			this.state.removeAllClickables(this.world);
		}
		if(keyGesture.key == "a" && keyGesture.ctrl) {
			if (this.state.clickables.length == this.world.clickables.length)
				this.state.clearClickables();
			else
				this.state.selectAllClickables(this.world);
		}
	}
}