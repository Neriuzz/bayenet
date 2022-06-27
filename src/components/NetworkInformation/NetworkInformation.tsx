// Styles
import "./NetworkInformation.scss";

// React
import { useEffect, useState } from "react";

// Icons
import { BsInfoCircle } from "react-icons/bs";
import { VscCircleLargeOutline } from "react-icons/vsc";
import { AiOutlineNodeIndex } from "react-icons/ai";

// Singleton data classes
import EventBus, { NetworkEvent } from "../../shared/EventBus";
import WorldData from "../../shared/WorldData";
import DiskStorage from "../DiskStorage/DiskStorage";

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

    const handleNetworkLoaded = () => {
        setNodeCount(worldData.numberOfNodes);
        setEdgeCount(worldData.numberOfEdges);
    };

    useEffect(() => {
        // Register event handlers
        eventBus.on(NetworkEvent.NODE_CREATED, handleNodeCreated);
        eventBus.on(NetworkEvent.NODE_DELETED, handleNodeDeleted);
        eventBus.on(NetworkEvent.EDGE_CREATED, handleEdgeCreated);
        eventBus.on(NetworkEvent.EDGE_DELTED, handleEdgeDeleted);
        eventBus.on(NetworkEvent.NETWORK_LOADED, () => handleNetworkLoaded());

        return () => {
            // Unregister event handlers
            eventBus.stopListening(NetworkEvent.NODE_CREATED, handleNodeCreated);
            eventBus.stopListening(NetworkEvent.NODE_DELETED, handleNodeDeleted);
            eventBus.stopListening(NetworkEvent.EDGE_CREATED, handleEdgeCreated);
            eventBus.stopListening(NetworkEvent.EDGE_DELTED, handleEdgeDeleted);
            eventBus.stopListening(NetworkEvent.NETWORK_LOADED, handleNetworkLoaded);
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
            <DiskStorage />
            <p className="tool-tip">Double-click on a node to view its information.</p>
        </div>
    );
};

export default NetworkInformation;
