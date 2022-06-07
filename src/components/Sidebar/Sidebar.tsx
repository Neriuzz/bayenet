import { useEffect, useState } from "react";

import "./Sidebar.scss";

import EventBus from "../../shared/EventBus";
import Node from "../../renderer/entities/Node";
import NodeInformation from "../NodeInformation/NodeInformation";
import NetworkInformation from "../NetworkInformation/NetworkInformation";

const eventBus = EventBus.instance;

const Sidebar = () => {
    const [node, setNode] = useState<Node>();

    const handleToggleSidebar = (node: Node) => {
        setNode(node);
    };

    useEffect(() => {
        eventBus.on("toggleSidebar", handleToggleSidebar);
        return () => eventBus.stopListening("toggleSidebar", handleToggleSidebar);
    }, []);

    return <div className="sidebar">{(node && <NodeInformation node={node} />) || <NetworkInformation />}</div>;
};

export default Sidebar;
