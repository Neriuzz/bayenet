import { useRef, useState } from "react";

// Icons
import { AiFillPlusCircle } from "react-icons/ai";

// Types
import { StateProbabilities } from "../../shared/DataModels/bayesian-node";

// For probability bar colours
import ColorHash from "color-hash";

// Styles
import "./NodeStates.scss";
export interface NodeStatesProps {
    states: string[];
    stateProbabilities: StateProbabilities;
    addState: (name: string) => void;
}

const NodeStates = ({ states, stateProbabilities, addState }: NodeStatesProps) => {
    const [addingState, setAddingState] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const colourHash = new ColorHash();

    const handleAddStateButtonClicked = () => {
        setAddingState(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // Retrieve name of new state
            const name = inputRef.current?.value || "";

            // Do not allow a state that is empty
            if (name.length <= 0) return;

            // Do not allow a state that already exists
            if (states.find((state) => state.toLowerCase() === name.toLowerCase())) return;

            // Add new state to the node
            addState(name);

            setAddingState(false);
        }
    };

    const handleOnBlur = () => {
        setAddingState(false);
    };

    return (
        <div className="node-states">
            {states.map((state, index) => (
                <div key={index} className="node-state">
                    <p className="state-name" title={state}>
                        {state}
                    </p>
                    <div
                        className="state-probability-bar"
                        style={{
                            width: `${Math.floor(stateProbabilities[state] * 100)}%`,
                            backgroundColor: colourHash.hex(state)
                        }}
                        title={stateProbabilities[state].toString()}
                    ></div>
                    <p className="state-probability">{`${Math.floor(stateProbabilities[state] * 100)}%`}</p>
                </div>
            ))}
            <div className="add-state">
                {addingState ? (
                    <input
                        key={Math.random()}
                        type="text"
                        name="new-state"
                        className="new-state-input"
                        autoComplete="off"
                        ref={inputRef}
                        onKeyDown={(event) => handleKeyDown(event)}
                        placeholder="New state name"
                        autoFocus={true}
                        onBlur={handleOnBlur}
                    ></input>
                ) : (
                    <AiFillPlusCircle
                        size="35px"
                        className="add-state-button"
                        onClick={handleAddStateButtonClicked}
                        title="Add new state to node"
                    />
                )}
            </div>
        </div>
    );
};

export default NodeStates;
