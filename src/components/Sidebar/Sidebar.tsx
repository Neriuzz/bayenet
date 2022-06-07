import { useEffect, useRef, useState } from "react";

import "./Sidebar.scss";

import EventBus from "../../events/EventBus";
import Node from "../../renderer/entities/Node";

const eventBus = EventBus.instance;

const Sidebar = () => {
    const [node, setNode] = useState<Node>();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleNameChange = (newName: string) => {
        if (node) node.name = newName;
    };

    const handleKeyDown = (key: string) => {
        if (key === "Enter") inputRef.current?.blur();
    };

    const handleToggleSidebar = (node: Node) => {
        setNode(node);
    };

    useEffect(() => {
        eventBus.on("toggleSidebar", handleToggleSidebar);
        return () => eventBus.stopListening("toggleSidebar", handleToggleSidebar);
    }, []);

    return (
        (node && (
            <div className="sidebar">
                <input
                    key={Math.random()}
                    type="text"
                    name="node-name"
                    className="node-name"
                    defaultValue={node.name}
                    autoComplete="off"
                    onChange={(event) => handleNameChange(event.target.value)}
                    onKeyDown={(event) => handleKeyDown(event.key)}
                    ref={inputRef}
                />
                <p> {`Postion: (${node.position.x}, ${node.position.y})`} </p>
            </div>
        )) ||
        null
    );
};

export default Sidebar;
