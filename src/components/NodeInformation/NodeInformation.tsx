import { useRef } from "react";
import Node from "../../renderer/entities/Node";
import "./NodeInformation.scss";

interface NodeInformationProps {
    node: Node;
}

const NodeInformation = (props: NodeInformationProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleNameChange = (newName: string) => {
        props.node.name = newName;
    };

    const handleKeyDown = (key: string) => {
        if (key === "Enter") inputRef.current?.blur();
    };

    return (
        <>
            <input
                key={Math.random()}
                type="text"
                name="node-name"
                className="node-name"
                defaultValue={props.node.name}
                autoComplete="off"
                onChange={(event) => handleNameChange(event.target.value)}
                onKeyDown={(event) => handleKeyDown(event.key)}
                ref={inputRef}
            />
            <p> {`Postion: (${props.node.position.x}, ${props.node.position.y})`} </p>
        </>
    );
};

export default NodeInformation;
