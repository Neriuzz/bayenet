import Camera from "../Camera";
import ContextConfiguration from "../ContextConfiguration";

interface IRenderable {
	render: (context: CanvasRenderingContext2D) => void
	isInView: (camera: Camera) => boolean
}


export default IRenderable;

