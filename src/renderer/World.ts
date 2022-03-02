import Camera from "./Camera";
import IRenderable from "./interfaces/IRenderable";

export default class World {
	objects: IRenderable[];

	constructor(private camera: Camera) {
		this.objects = [];
	}

	public addObject(object: IRenderable) {
		object.setID(this.objects.push(object) - 1);
	}

	public removeObject(object: IRenderable) {
		this.objects = this.objects.filter(obj => obj.getID() != object.getID())
	}

	public getAllObjects(): IRenderable[] {
		return this.objects;
	}

	public getAllObjectsInView(): IRenderable[] {
		return this.objects.filter(object => object.isInView(this.camera.getCanvasBounds(), this.camera.getCurrentPosition()));
	}
}