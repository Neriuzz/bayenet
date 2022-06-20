import { useRef, useState } from "react";

// Icons
import { AiFillPlusCircle } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";

// Types
import { INodeResult } from "bayesjs";

// For probability bar colours
import ColorHash from "color-hash";

// Styles
import "./NodeStates.scss";
export interface NodeStatesProps {
    states: string[];
    stateProbabilities: INodeResult;
    addState: (name: string) => void;
    removeState: (index: number) => void;
}

const NodeStates = ({ states, stateProbabilities, addState, removeState }: NodeStatesProps) => {
    const [addingState, setAddingState] = useState(false);

    const roundNumber = (num: number) => {
        return Number.isInteger(num) ? num : +num.toFixed(2);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    const colourHash = new ColorHash();

    const handleAddStateButtonClicked = () => {
        setAddingState(true);
    };

    const handleRemoveStateButtonClicked = (index: number) => {
        // Only allow to remove a states if it does not leave the node stateless
        if (states.length > 1) removeState(index);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            // Retrieve name of new state
            const name = inputRef.current?.value || "";

            // Do not allow a state that is empty
            if (name.length <= 0) {
                // Set input field border to red to indicate that there is an error
                inputRef.current!.style.borderBottom = "1px solid red";
                return;
            }

            // Do not allow a state that already exists
            if (states.find((state) => state.toLowerCase() === name.toLowerCase())) {
                inputRef.current!.style.borderBottom = "1px solid red";
                return;
            }

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
                            width:
                                stateProbabilities[state] > 0.025
                                    ? `${Math.floor(stateProbabilities[state] * 100)}%`
                                    : "2%",
                            backgroundColor: colourHash.hex(state)
                        }}
                        title={stateProbabilities[state].toString()}
                    ></div>
                    <p className="state-probability">{`${roundNumber(stateProbabilities[state] * 100)}%`}</p>
                    <div className="node-state-buttons">
                        <BsTrash
                            className="node-state-button"
                            size="20px"
                            title="Remove state"
                            onClick={() => handleRemoveStateButtonClicked(index)}
                        />
                    </div>
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
                        className="node-state-button"
                        onClick={handleAddStateButtonClicked}
                        title="Add new state to node"
                    />
                )}
            </div>
        </div>
    );
};

export default NodeStates;
