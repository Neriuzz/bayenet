import Camera from "./Camera";
import Entity from "./interfaces/Entity";

export default class World {
	private _entities: Entity[];

	constructor(private _camera: Camera) {
		this._entities = [];
	}

	public addEntity(entity: Entity) {
		this._entities.push(entity);
	}

	public removeEntity(entity: Entity) {
		this._entities = this._entities.filter(ent => ent.id != entity.id)
	}

	public get entities(): Entity[] {
		return this._entities;
	}

	public get entitiesInView(): Entity[] {
		return this._entities.filter(entity => entity.isInView(this._camera.getCanvasBounds(), this._camera.getCurrentPosition()));
	}

	public get mousedOverEntity(): Entity | undefined {
		return this.entitiesInView.find(entity => entity.isMouseOver(this._camera.getMousePosition(), this._camera.getCurrentPosition()));
	}
}