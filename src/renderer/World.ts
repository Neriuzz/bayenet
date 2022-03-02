import Camera from "./Camera";
import IRenderable from "./interfaces/IRenderable";

export default class World {
	objects: IRenderable[];

	constructor(private camera: Camera) {
		this.objects = [];
	}

	public addObject(object: IRenderable) {
		this.objects.push(object);
	}

	public getAllObjects(): IRenderable[] {
		return this.objects;
	}

	public getAllObjectsInView(): IRenderable[] {
		return this.objects.filter(object => object.isInView(this.camera.getCanvasBounds(), this.camera.getCurrentPosition()));
	}
}