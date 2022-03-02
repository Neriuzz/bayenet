import Camera from "./Camera";
import IRenderable from "./interfaces/IRenderable";

export default class World {
	objects: IRenderable[];

	constructor() {
		this.objects = [];
	}

	public addObject(object: IRenderable) {
		this.objects.push(object);
	}

	public getAllObjects(): IRenderable[] {
		return this.objects;
	}

	public getAllObjectsInView(camera: Camera): IRenderable[] {
		return this.objects.filter(object => object.isInView(camera));
	}
}