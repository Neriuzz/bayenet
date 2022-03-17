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


export default class World {
	private _renderables: IRenderable[] = [];
	private _nextID: number = 0;

	constructor(private _camera: Camera) {}

	private addRenderable(renderable: IRenderable) {
		this._renderables.push(renderable);
	}

	private removeRenderable(renderable: IRenderable) {
		this._renderables = this._renderables.filter(_renderable => _renderable.id != renderable.id);
	}

	public get renderables(): IRenderable[] {
		return this._renderables;
	}

	public get renderablesInView(): IRenderable[] {
		return this._renderables.filter(renderable => renderable.isInView(this._camera.currentPosition, this._camera.canvasBounds));
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

	public get selectedClickables(): IClickable[] {
		return this._renderables.filter(renderable => isClickable(renderable) && renderable.selected) as any;
	}

	public get camera(): Camera {
		return this._camera;
	}

	public createNode(coords: Vector2D) {
		let node = new Node(this._nextID++, coords, 20);
		this.addRenderable(node);
	}

	public deleteNode(node: Node) {
		this.removeRenderable(node);
	}
};