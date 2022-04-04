import EventBus from "@/events/EventBus";
import Node from "@/renderer/entities/Node";
import { useState } from "react";

const eventBus = EventBus.instance;

const Sidebar = () => {
	const [node, setNode] = useState<Node | undefined>();

	eventBus.on("nodeDoubleClicked", (node: Node) => {
		setNode(undefined);
		setNode(node);
	});

	return (
		<h1>{node ? `Hello Node ${node.id}, you are x: ${node.position.x}, y: ${node.position.y}` : "Hello"}</h1>
	);
};

export default Sidebar;