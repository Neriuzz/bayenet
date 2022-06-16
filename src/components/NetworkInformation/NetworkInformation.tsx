// Styles
import "./NetworkInformation.scss";

// React
import { useEffect, useState } from "react";

// Icons
import { BsInfoCircle } from "react-icons/bs";
import { VscCircleLargeOutline } from "react-icons/vsc";
import { AiOutlineNodeIndex } from "react-icons/ai";

// Singleton data classes
import EventBus from "../../shared/EventBus";
import WorldData from "../../shared/WorldData";

// Setup singleton instances
const eventBus = EventBus.instance;
const worldData = WorldData.instance;

const NetworkInformation = () => {
    // State for network information
    const [nodeCount, setNodeCount] = useState(worldData.numberOfNodes);
    const [edgeCount, setEdgeCount] = useState(worldData.numberOfEdges);

    // Event handlers
    const handleNodeCreated = () => {
        setNodeCount((nodeCount) => nodeCount + 1);
    };

    const handleNodeDeleted = () => {
        setNodeCount((nodeCount) => nodeCount - 1);
    };

    const handleEdgeCreated = () => {
        setEdgeCount((edgeCount) => edgeCount + 1);
    };

    const handleEdgeDeleted = () => {
        setEdgeCount((edgeCount) => edgeCount - 1);
    };

    useEffect(() => {
        // Register event handlers
        eventBus.on("nodeCreated", handleNodeCreated);
        eventBus.on("nodeDeleted", handleNodeDeleted);
        eventBus.on("edgeCreated", handleEdgeCreated);
        eventBus.on("edgeDeleted", handleEdgeDeleted);

        return () => {
            // Unregister event handlers
            eventBus.stopListening("nodeCreated", handleNodeCreated);
            eventBus.stopListening("nodeDeleted", handleNodeDeleted);
            eventBus.stopListening("edgeCreated", handleEdgeCreated);
            eventBus.stopListening("edgeDeleted", handleEdgeDeleted);
        };
    }, []);

    return (
        <div className="network-info">
            <BsInfoCircle className="icon" size={"72px"} />
            <p className="info-desc">Number of nodes in the network</p>
            <div className="count">
                <VscCircleLargeOutline className="icon" size={"40px"} />
                <p className="count-number">{nodeCount}</p>
            </div>
            <p className="info-desc">Number of edges in the network</p>
            <div className="count">
                <AiOutlineNodeIndex className="icon" size={"40px"} />
                <p className="count-number">{edgeCount}</p>
            </div>
            <p className="tool-tip">Double-click on a node to view its information.</p>
        </div>
    );
};

export default NetworkInformation;
