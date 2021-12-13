import Renderable from "../interfaces/Renderable";

export default class Node implements Renderable {
	render() {
		console.log("rendering");
	}
}