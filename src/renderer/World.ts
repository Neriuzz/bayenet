import IRenderable from "./interfaces/IRenderable";

import Camera from "./Camera";

import Node from "./entities/Node";

import Vector2D from "./Vector2D";
import IClickable from "./interfaces/IClickable";


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

	public get selectedRenderables(): IRenderable[] {
		return this._renderables.filter(renderable => (renderable as IClickable).clicked);
	}

	public get camera(): Camera {
		return this._camera;
	}

	public createNode(coords: Vector2D) {
		this.addRenderable(new Node(this._nextID++, coords, 20));
	}

	public deleteNode(node: Node) {
		this.removeRenderable(node);
	}
}