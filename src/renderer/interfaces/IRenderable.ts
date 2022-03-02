import Camera from "../Camera";
import ContextConfiguration from "../ContextConfiguration";
import Vector2D from "../Vector2D";
import IHoverable from "./IHoverable";

interface IRenderable extends IHoverable {
	render: (context: CanvasRenderingContext2D) => void
	isInView: (canvasBounds: Vector2D, cameraPosition: Vector2D) => boolean
	setID: (id: number) => void
	getID: () => number
}


export default IRenderable;

