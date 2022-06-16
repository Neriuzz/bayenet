import { useRef } from "react";

import "./NodeName.scss";

export interface NodeNameProps {
    name: string;
    updateName: (newName: string) => void;
}

const NodeName = ({ name, updateName }: NodeNameProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (key: string) => {
        if (key === "Enter") inputRef.current?.blur();
    };

    return (
        <input
            key={Math.random()}
            type="text"
            name="node-name"
            className="node-name"
            defaultValue={name}
            autoComplete="off"
            onChange={(event) => updateName(event.target.value)}
            onKeyDown={(event) => handleKeyDown(event.key)}
            ref={inputRef}
        />
    );
};

export default NodeName;
