import Renderable from "./Renderable";

class Node implements Renderable {
	render() {
		console.log("rendering");
	}
}

export default Node;