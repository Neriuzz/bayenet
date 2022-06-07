import "./NetworkInformation.scss";

import { useEffect, useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { VscCircleLargeOutline } from "react-icons/vsc";
import { AiOutlineNodeIndex } from "react-icons/ai";

import WorldAPI from "../../shared/WorldAPI";
import EventBus from "../../shared/EventBus";

const worldAPI = WorldAPI.instance;
const eventBus = EventBus.instance;

const NetworkInformation = () => {
    const [nodeCount, setNodeCount] = useState(worldAPI.numberOfNodes() || 0);
    const [edgeCount, setEdgeCount] = useState(worldAPI.numberOfEdges() || 0);

    const handleNodeCreated = () => {
        console.log("Node created");
        setNodeCount((nodeCount) => nodeCount + 1);
    };

    const handleNodeDeleted = () => {
        setNodeCount(nodeCount - 1);
    };

    const handleEdgeCreated = () => {
        setEdgeCount(edgeCount + 1);
    };

    const handleEdgeDeleted = () => {
        setEdgeCount(edgeCount - 1);
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
            <div className="count">
                <VscCircleLargeOutline className="icon" size={"50px"} />
                <p>{nodeCount}</p>
            </div>
            <div className="count">
                <AiOutlineNodeIndex className="icon" size={"50px"} />
                <p>{edgeCount}</p>
            </div>
        </div>
    );
};

export default NetworkInformation;
