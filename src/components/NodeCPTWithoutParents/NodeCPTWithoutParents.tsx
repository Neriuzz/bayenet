import { useRef, useState } from "react";

// Icons
import { FaSave } from "react-icons/fa";

// Types
import { ICptWithoutParents, ICptWithParents } from "bayesjs";

// Styles
import "./NodeCPTWithoutParents.scss";

// Component props
export interface NodeCPTWithoutParentsProps {
    states: string[];
    cpt: ICptWithoutParents;
    updateCPT: (newCpt: ICptWithParents | ICptWithoutParents) => void;
}

const NodeCPTWithoutParents = ({ states, cpt, updateCPT }: NodeCPTWithoutParentsProps) => {
    const [allowSubmit, setAllowSubmit] = useState(false);

    const cptCopy = useRef<ICptWithoutParents>({ ...cpt });
    // Make sure no removed states are in the cptCopy
    Object.keys(cptCopy.current).forEach((state) => {
        if (!states.includes(state)) delete cptCopy.current[state];
    });

    // Stores all the input fields that currently have incorrect values in them
    const badValues = useRef<HTMLInputElement[]>([]);

    const handleOnSubmit = () => {
        if (allowSubmit) updateCPT(cptCopy.current);
    };

    const handleOnChange = (state: string, value: number, inputRef: HTMLInputElement) => {
        // Initially, do not show an error
        badValues.current.forEach((inputRef) => (inputRef.style.color = "white"));

        // Update cpt copy
        cptCopy.current[state] = value;

        // Get all other state probabilites
        const otherStates = Object.keys(cpt).filter((_state) => _state !== state);

        // Get the sum of all the probabilities
        const sumOfAllStates = otherStates.reduce((acc, state) => acc + cptCopy.current[state], value);

        // If probabilities do not sum up to 1, don't allow user to save the cpt
        if (sumOfAllStates !== 1) {
            // Add input element to bad values so that it can be highlighted
            badValues.current.push(inputRef);

            // For each input field containing a bad probability value, set the text colour to red
            badValues.current.forEach((inputRef) => (inputRef.style.color = "rgba(255, 0, 0, 0.8)"));

            // Do not allow submission
            setAllowSubmit(false);

            // Early return
            return;
        }

        // Otherwise the new values are good

        // Remove the input element from the bad values if it exists
        badValues.current = [];

        // Allow user to save CPT
        setAllowSubmit(true);
    };

    return (
        <div className="cpt-no-parents">
            <div className="cpt-table-no-parents-container">
                <table className="cpt-table-no-parents">
                    <thead>
                        <tr className="table-states">
                            {Object.keys(cpt).map((state, index) => (
                                <th className="table-state" key={index}>
                                    {state}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-probabilities">
                            {Object.keys(cpt).map((state) => (
                                <td className="table-probability" key={state}>
                                    <input
                                        key={Object.keys(cpt).length}
                                        className="probability-input"
                                        type="number"
                                        defaultValue={+cpt[state].toFixed(5)}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        onChange={(event) =>
                                            handleOnChange(state, event.target.valueAsNumber, event.target)
                                        }
                                    />
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
            <FaSave
                className="submit-no-parent-cpt"
                size="30px"
                onClick={handleOnSubmit}
                title="Save conditional probability table"
            />
        </div>
    );
};

export default NodeCPTWithoutParents;
