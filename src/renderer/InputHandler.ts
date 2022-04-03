// Required imports
import World from "./World";
import Vector2D from "./util/Vector2D";
import Board from "./entities/Board";

// Interfaces
import IInteractable from "./interfaces/IInteractable";
import IClickable from "./interfaces/IClickable";
import IDraggable from "./interfaces/IDraggable";
import ClickGesture from "./gestures/ClickGesture";
import KeyGesture from "./gestures/KeyGesture";
import DragGesture from "./gestures/DragGesture";
import IHoverable from "./interfaces/IHoverable";
import WorldState from "./WorldState";

export default class InputHandler {
	// Access to world state
	private state = WorldState.instance;

	// Timer for differentiating between clicks and double clicks
	private timer: NodeJS.Timeout | null = null;

	// Object that handles events that happen on the board itself
	private board: Board;

	constructor(private world: World) {
		this.board = new Board(this.world);

		// Register window event listeners
		window.addEventListener("resize", () => this.onResize());

		// Register canvas event listeners
		this.world.camera.canvas.addEventListener("mousedown", (event: MouseEvent) => this.onMouseDown(event));
		this.world.camera.canvas.addEventListener("mouseup", (event: MouseEvent) => this.onMouseUp(event));
		this.world.camera.canvas.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
		this.world.camera.canvas.addEventListener("click", (event: MouseEvent) => this.onClick(event));
		this.world.camera.canvas.addEventListener("dblclick", (event: MouseEvent) => this.onDoubleClick(event));
		this.world.camera.canvas.addEventListener("keydown", (event: KeyboardEvent) => this.onKeyDown(event));
		// this.world.camera.canvas.addEventListener("wheel", (event: WheelEvent) => this.onMouseWheel(event));

		// Initial canvas resize
		this.onResize();
	}

	private getInteractable(interactables: IInteractable[], position: Vector2D): IInteractable {
		let [interactable] = interactables
			.filter(interactable => interactable.isMouseOver(position))
			.sort((a, b) => a.zIndex - b.zIndex)
			.reverse();

		return interactable;
	}

	public getZIndex(draggable: IDraggable, position: Vector2D): number {
		let [interactable] = this.world.interactablesInView
				.filter(interactable => interactable.id !== draggable.id && interactable.isMouseOver(position))
				.sort((a, b) => a.zIndex - b.zIndex)
				.reverse();
		
		return interactable?.zIndex + 1 || 1;
	}

	public getTruePosition(position: Vector2D) {
		return new Vector2D(position.x - this.world.camera.position.x, position.y - this.world.camera.position.y);
	}

	private onKeyDown(event: KeyboardEvent) {
		event.preventDefault();
		
		let keyGesture: KeyGesture = {
			key: event.key,
			ctrl: event.ctrlKey,
			alt: event.altKey,
			shift: event.shiftKey
		};

		this.board.onKeyDown(keyGesture);
	}

	// private onMouseWheel(event: WheelEvent) {
	// 	event.preventDefault();
	// 	this.board.onMouseWheel(event);
	// }

	private onClick(event: MouseEvent) {
		event.preventDefault();

		// Do not call on click handler if we are currently dragging or this is our second click
		if (this.state.dragging || event.detail !== 1)
			return;

		
		this.timer = setTimeout(() => {		
			let position = this.getTruePosition(new Vector2D(event.clientX, event.clientY));

			let clickGesture: ClickGesture = {
				position,
				alt: event.altKey,
				shift: event.shiftKey,
				world: this.world
			};

			let clickable = this.getInteractable(this.world.clickablesInView, position) as IClickable;
			
			clickable ? clickable.onClick(clickGesture) : this.board.onClick();
		}, 200);
	}

	private onDoubleClick(event: MouseEvent) {
		event.preventDefault();

		clearTimeout(this.timer!);

		if (this.state.edgeBeingCreated)
			return;

		let position = this.getTruePosition(new Vector2D(event.clientX, event.clientY));
		let clickGesture: ClickGesture = { 
			position,
			alt: event.altKey,
			shift: event.shiftKey
		 };

		let clickable = this.getInteractable(this.world.clickablesInView, position) as IClickable;

		clickable ? clickable.onDoubleClick(clickGesture) : this.board.onDoubleClick(clickGesture);
	}

	private onMouseDown(event: MouseEvent) {
		event.preventDefault();

		this.state.dragging = false;

		let position = new Vector2D(event.clientX, event.clientY);
		let dragGesture: DragGesture = {
			position
		};

		let draggable = this.getInteractable(this.world.draggablesInView, this.getTruePosition(position)) as IDraggable;

		draggable ? draggable.onDragStart(dragGesture) : this.board.onDragStart(dragGesture);
	}
		
	private onMouseMove(event: MouseEvent) {
		event.preventDefault();
		
		let position = new Vector2D(event.clientX, event.clientY);

		this.state.mousePosition = this.getTruePosition(position);

		this.state.dragging = true;

		if (this.board.dragging) {
			let dragGesture: DragGesture = {
				position
			};
			this.board.onDrag(dragGesture);
			return;
		}

		if (this.state.currentlyDragging) {
			let zIndex = Number.MAX_SAFE_INTEGER;
			let dragGesture: DragGesture = {
				position,
				zIndex
			};
			this.state.currentlyDragging.onDrag(dragGesture);
			return;
		}

		this.onHover(this.getTruePosition(position));
	}

	private onMouseUp(event: MouseEvent) {
		event.preventDefault();

		let position = new Vector2D(event.clientX, event.clientY);

		if (this.board.dragging) {
			this.board.onDragEnd();
			return;
		}

		if (this.state.currentlyDragging) {
			let zIndex = this.getZIndex(this.state.currentlyDragging, this.getTruePosition(position));
			let dragGesture: DragGesture = {
				position,
				zIndex
			};
			this.state.currentlyDragging.onDragEnd(dragGesture);
		}
	}

	private onHover(position: Vector2D) {
		if (this.state.currentlyHovering) {
			if (this.state.currentlyHovering.isMouseOver(position))
				this.state.currentlyHovering.onHovering();
			else
				this.state.currentlyHovering.onExitHover();
			return;
		}
		
		let hoverable = this.getInteractable(this.world.hoverablesInView, position) as IHoverable;
		hoverable?.onEnterHover();
	}

	private onResize() {
		// Scale and resize the canvas appropriately based on device width, height and pixel ratio
		this.world.camera.canvas.width = window.innerWidth * window.devicePixelRatio;
		this.world.camera.canvas.height = window.innerHeight * window.devicePixelRatio;
		this.world.camera.canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
	}
};