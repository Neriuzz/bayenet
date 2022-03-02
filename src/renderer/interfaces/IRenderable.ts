import Camera from "../Camera";
import ContextConfiguration from "../ContextConfiguration";
import Vector2D from "../Vector2D";

interface IRenderable {
	render: (context: CanvasRenderingContext2D) => void
	isInView: (canvasBounds: Vector2D, cameraPosition: Vector2D) => boolean
}


export default IRenderable;

