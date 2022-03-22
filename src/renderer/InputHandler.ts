// Required imports
import World from "./World";
import Vector2D from "./util/Vector2D";
import Board from "./entities/Board";

// Interfaces
import IInteractable from "./interfaces/IInteractable";
import IClickable from "./interfaces/IClickable";
import IDraggable from "./interfaces/IDraggable";
import ClickGesture from "./gestures/ClickGesture";

export default class InputHandler {
	// Variable for differentiating between drags and clicks
	private dragging = false;

	// Timer for differentiating between clicks and double clicks
	private timer: NodeJS.Timeout | null = null;

	// Object that handles events that happen on the board itself
	private board: Board;

	constructor(private _canvas: HTMLCanvasElement, private _world: World) {
		this.board = new Board(this._world);

		// Register window event listeners
		window.addEventListener("resize", () => this.onResize());

		// Register canvas event listeners
		this._canvas.addEventListener("mousedown", (event: MouseEvent) => this.onMouseDown(event));
		this._canvas.addEventListener("mouseup", (event: MouseEvent) => this.onMouseUp(event));
		this._canvas.addEventListener("mousemove", (event: MouseEvent) => this.onMouseMove(event));
		this._canvas.addEventListener("click", (event: MouseEvent) => this.onClick(event));
		this._canvas.addEventListener("dblclick", (event: MouseEvent) => this.onDoubleClick(event));
		this._canvas.addEventListener("keydown", (event: KeyboardEvent) => this.onKeyDown(event));

		// Initial canvas resize
		this.onResize();
	}

	private getInteractable(interactables: IInteractable[], mousePosition: Vector2D): IInteractable {
		let [interactable] = interactables
			.filter(interactable => interactable.isMouseOver(this._world.camera.currentPosition, mousePosition))
			.sort(interactable => interactable.zIndex);

		return interactable ?? this.board;
	}

	private get currentlyDragging(): IDraggable | undefined {
		return this.board.dragging ? this.board : this._world.draggablesInView.find(draggable => draggable.dragging);
	}

	private onKeyDown(event: KeyboardEvent) {
		event.preventDefault();
		
		const keyGesture = {
			key: event.key,
			selected: this._world.selectedClickables
		};

		this.board.onKeyDown(keyGesture);
	}

	private onClick(event: MouseEvent) {
		event.preventDefault();

		// Do not call on click handler if we are currently dragging something
		if (this.dragging)
			return;

		if (event.detail === 1) {
			this.timer = setTimeout(() => {		
				let position = new Vector2D(event.clientX, event.clientY);	
				let offset = this._world.camera.currentPosition;
				const clickGesture = {
					position,
					offset,
					selected: this._world.selectedClickables,
					altPressed: event.altKey
				};

				// Retrieve the entity we are clicking on
				let clickable = this.getInteractable(this._world.clickablesInView, position) as IClickable;

				// If we are clicking on something, then perfrom the click action
				clickable.onClick(clickGesture);
			}, 200);
		}
	}

	private onDoubleClick(event: MouseEvent) {
		event.preventDefault();

		clearTimeout(this.timer!);

		let position = new Vector2D(event.clientX, event.clientY);
		let offset = this._world.camera.currentPosition;
		const clickGesture = { 
			position,
			offset
		 };

		let clickable = this.getInteractable(this._world.clickablesInView, position) as IClickable;
	
		clickable.onDoubleClick(clickGesture);
	}

	private onMouseDown(event: MouseEvent) {
		event.preventDefault();

		this.dragging = false;

		let position = new Vector2D(event.clientX, event.clientY);
		const dragGesture = {
			position
		};

		let draggable = this.getInteractable(this._world.draggablesInView, position) as IDraggable;

		draggable.onDragStart(dragGesture);
	}
		
	private onMouseMove(event: MouseEvent) {
		event.preventDefault();

		this.dragging = true;

		let position = new Vector2D(event.clientX, event.clientY);
		const dragGesture = {
			position
		};

		this.currentlyDragging?.onDrag(dragGesture);
	}

	private onMouseUp(event: MouseEvent) {
		event.preventDefault();

		let position = new Vector2D(event.clientX, event.clientY);
		const dragGesture = {
			position
		};

		this.currentlyDragging?.onDragEnd(dragGesture);
	}

	private onResize() {
		// Scale and resize the canvas appropriately based on device width, height and pixel ratio
		this._canvas.width = window.innerWidth * window.devicePixelRatio;
		this._canvas.height = window.innerHeight * window.devicePixelRatio;
		this._canvas.style.transform = `scale(${1 / window.devicePixelRatio})`;
	}
};