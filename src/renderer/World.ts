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
import EntityType from "./EntityType";


export default class World {
	public entities: IEntity[] = [];
	private nextID: number = 0;

	constructor(public readonly camera: Camera) {}

	public addEntity(entity: IEntity) {
		this.entities.push(entity);
	}

	public removeEntity(entity: IEntity) {
		switch (entity.type) {
			case EntityType.NODE:
				let node = entity as Node;
				if (node.edge)
					this.removeEntity(node.edge);
				break;
			case EntityType.EDGE:
				let edge = entity as Edge;
				edge.from.edge = null;
				if (edge.to) 
					edge.to.edge = null;
				break;
			default:
				break;
		}
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
		let node = new Node(this.nextID++, coords, 25);
		this.addEntity(node);
		return node;
	}

	public createEdge(from: Node) {
		let edge = new Edge(this.nextID++, 10, from);
		this.addEntity(edge);
		return edge;
	}
};