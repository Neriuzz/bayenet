import { useEffect, useState } from "react";

import "./Sidebar.scss";

import EventBus from "../../shared/EventBus";
import Node from "../../renderer/entities/Node";
import NodeInformation from "../NodeInformation/NodeInformation";
import NetworkInformation from "../NetworkInformation/NetworkInformation";

const eventBus = EventBus.instance;

const Sidebar = () => {
    const [node, setNode] = useState<Node>();

    const handleToggleNodeInformation = (node: Node) => {
        setNode(node);
    };

    useEffect(() => {
        eventBus.on("toggleNodeInformation", handleToggleNodeInformation);
        return () => eventBus.stopListening("toggleNodeInformation", handleToggleNodeInformation);
    }, []);

    return <div className="sidebar">{(node && <NodeInformation node={node} />) || <NetworkInformation />}</div>;
};

export default Sidebar;
