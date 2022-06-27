import { useEffect, useState } from "react";

import "./Sidebar.scss";

import EventBus, { UserEvent } from "../../shared/EventBus";
import Node from "../../renderer/entities/Node";
import NodeInformation from "../NodeInformation/NodeInformation";
import NetworkInformation from "../NetworkInformation/NetworkInformation";

const eventBus = EventBus.instance;

const Sidebar = () => {
    const [node, setNode] = useState<Node>();

    const handleToggleNodeInformation = (node: Node) => {
        // Set the component state to the new node
        setNode(node);
    };

    useEffect(() => {
        eventBus.on(UserEvent.TOGGLE_NODE_INFORMATION, handleToggleNodeInformation);
        return () => eventBus.stopListening(UserEvent.TOGGLE_NODE_INFORMATION, handleToggleNodeInformation);
    }, []);

    return <div className="sidebar">{(node && <NodeInformation node={node} />) || <NetworkInformation />}</div>;
};

export default Sidebar;
