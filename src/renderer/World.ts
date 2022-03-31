// Camera
import Camera from "./Camera";

// Entities
import Node from "./entities/Node";
import Edge from "./entities/Edge";

// Utilities
import { isRenderable, isClickable, isHoverable, isDraggable } from "./util/TypeGuard";
import Vector2D from "./util/Vector2D";

// Interfaces
import IEntity from "./interfaces/IEntity";
import IRenderable from "./interfaces/IRenderable";
import IInteractable from "./interfaces/IInteractable";
import IClickable from "./interfaces/IClickable";
import IDraggable from "./interfaces/IDraggable";
import IHoverable from "./interfaces/IHoverable";


export default class World {
	public entities: IEntity[] = [];
	private nextID: number = 0;

	constructor(public readonly camera: Camera) {}

	public addEntity(entity: IEntity) {
		this.entities.push(entity);
	}

	public removeEntity(entity: IEntity) {
		this.entities = this.entities.filter(_entity => _entity.id !== entity.id);
	}

	public get renderables(): IRenderable[] {
		return this.entities.filter(isRenderable);
	}

	public get interactables(): IInteractable[] {
		return this.entities.filter(isClickable || isDraggable || isHoverable);
	}

	public get clickables(): IClickable[] {
		return this.entities.filter(isClickable);
	} 

	public get hoverables(): IHoverable[] {
		return this.entities.filter(isHoverable);
	}

	public get draggables(): IDraggable[] {
		return this.entities.filter(isDraggable);
	}

	public get renderablesInView(): IRenderable[] {
		return this.renderables.filter(renderable => renderable.isInView(this.camera.position, this.camera.bounds));
	}
	
	public get interactablesInView(): IInteractable[] {
		return this.renderablesInView.filter(isClickable || isDraggable || isHoverable) as any;
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
	
	public createNode(coords: Vector2D) {
		let node = new Node(this.nextID++, coords, 20);
		this.addEntity(node);
		return node;
	}

	public deleteNode(node: Node) {
		this.removeEntity(node);
	}

	public createEdge(from: Node) {
		let edge = new Edge(this.nextID++, from);
		this.addEntity(edge);
		return edge;
	}

	public deleteEdge(edge: Edge) {
		this.removeEntity(edge);
	}
};