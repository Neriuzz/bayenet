import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import "./Sidebar.scss";

import EventBus from "../../events/EventBus";
import Node from "../../renderer/entities/Node";

const eventBus = EventBus.instance;

const Sidebar = () => {
    const [node, setNode] = useState<Node>();
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleNameChange = useCallback(
        (newName: string) => {
            if (node) node.name = newName;
        },
        [node]
    );

    const handleKeyDown = useCallback((key: string) => {
        if (key === "Enter") inputRef.current?.blur();
    }, []);

    const handleToggleSidebar = useCallback((node: Node) => {
        forceUpdate();
        setNode(node);
    }, []);

    useEffect(() => {
        eventBus.on("toggleSidebar", handleToggleSidebar);
        return () => eventBus.stopListening("toggleSidebar", handleToggleSidebar);
    }, [handleToggleSidebar]);

    return (
        (node && (
            <div className="sidebar">
                <input
                    type="text"
                    name="node-name"
                    className="node-name"
                    defaultValue={node.name}
                    autoComplete="off"
                    onChange={(event) => handleNameChange(event.target.value)}
                    ref={inputRef}
                    onKeyDown={(event) => handleKeyDown(event.key)}
                />
                <p> {`Postion: (${node.position.x}, ${node.position.y})`} </p>
            </div>
        )) || (
            <div className="sidebar">
                <p>xd</p>
            </div>
        )
    );
};

export default Sidebar;
