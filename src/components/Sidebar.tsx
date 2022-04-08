import EventBus from "@/events/EventBus";
import Node from "@/renderer/entities/Node";
import "@styles/Sidebar.scss";
import { useEffect, useReducer, useState } from "react";

const eventBus = EventBus.instance;

const Sidebar = () => {
	const [node, setNode] = useState<Node>(); 
	const [_, forceUpdate] = useReducer(x => x + 1, 0);

	const handleNameChange = (newName: string) => {
		node!.name = newName;
	};

	useEffect(() => {
		const handleToggleSidebar = (node: Node) => {
			forceUpdate();
			setNode(node);
		};

		eventBus.on("toggleSidebar", handleToggleSidebar);
		return () => eventBus.stopListening("toggleSidebar", handleToggleSidebar);

	}, [node]);

	if (node)
		return (
			<div className="sidebar">
				<input type="text" name="node-name" className="node-name" defaultValue={node.name} autoComplete="off" onChange={(event) => handleNameChange(event.target.value)}/>
				<p> {`Postion: (${node.position.x}, ${node.position.y})`} </p>
			</div>
		);
	else
		return null;
};

export default Sidebar;