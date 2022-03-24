// Required imports
import Camera from "./Camera";
import Node from "./entities/Node";

// Utilities
import Vector2D from "./util/Vector2D";
import { isClickable, isHoverable, isDraggable } from "./util/TypeGuard";

// Interfaces
import IRenderable from "./interfaces/IRenderable";
import IClickable from "./interfaces/IClickable";
import IHoverable from "./interfaces/IHoverable";
import IDraggable from "./interfaces/IDraggable";
import IInteractable from "./interfaces/IInteractable";


export default class World {
	private renderables: IRenderable[] = [];
	private nextID: number = 0;

	constructor(public readonly camera: Camera) {}

	private addRenderable(renderable: IRenderable) {
		this.renderables.push(renderable);
	}

	private removeRenderable(renderable: IRenderable) {
		this.renderables = this.renderables.filter(_renderable => _renderable.id !== renderable.id);
	}

	public get renderablesInView(): IRenderable[] {
		return this.renderables.filter(renderable => renderable.isInView(this.camera.position, this.camera.bounds));
	}

	public get clickables(): IClickable[] {
		return this.renderables.filter(isClickable) as any;
	}

	public get clickablesInView(): IClickable[] {
		return this.renderablesInView.filter(isClickable) as any;
	}

	public get hoverablesInView(): IHoverable[] {
		return this.renderablesInView.filter(isHoverable) as any;
	}

	public get draggablesInView(): IDraggable[] {
		return this.renderablesInView.filter(isDraggable) as any;
	}

	public get interactablesInView(): IInteractable[] {
		return this.renderablesInView.filter(isClickable || isDraggable || isHoverable) as any;
	}

	public get selectedClickables(): IClickable[] {
		return this.renderables.filter(renderable => isClickable(renderable) && renderable.selected) as any;
	}

	public createNode(coords: Vector2D) {
		let node = new Node(this.nextID++, coords, 20);
		this.addRenderable(node);
	}

	public deleteNode(node: Node) {
		this.removeRenderable(node);
	}
};