import { useRef, useState } from "react";

// Types
import { ICptWithoutParents, ICptWithParents } from "bayesjs";

// Icons
import { FaSave } from "react-icons/fa";

// Styles
import "./NodeCPTWithParents.scss";

// For precise arithmetic
import { mathExact } from "math-exact";

// Component props
export interface NodeCPTWithParentsProps {
    cpt: ICptWithParents;
    parents: string[];
    states: string[];
    updateCPT: (newCpt: ICptWithParents | ICptWithoutParents) => void;
}

const NodeCPTWithParents = ({ cpt, parents, states, updateCPT }: NodeCPTWithParentsProps) => {
    const [allowSubmit, setAllowSubmit] = useState(false);
    const cptCopy = useRef<ICptWithParents>([...cpt]);
    const badValues = useRef<HTMLInputElement[]>([]);

    const handleOnSubmit = () => {
        if (allowSubmit) {
            updateCPT(cptCopy.current);
        }
    };

    const handleOnChange = (state: string, entryNumber: number, value: number, inputRef: HTMLInputElement) => {
        // Initially, do not show an error
        badValues.current.forEach((inputRef) => (inputRef.style.color = "white"));

        // Update cpt copy
        cptCopy.current[entryNumber].then[state] = value;

        // Get all other state probabilites
        const otherStates = Object.keys(cpt[entryNumber].then).filter((_state) => _state !== state);

        // Get the sum of all the probabilities
        const sumOfAllStates = otherStates.reduce(
            (acc, state) => mathExact("Add", acc, cptCopy.current[entryNumber].then[state]),
            value
        );

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
        <div className="cpt-parents">
            <div className="cpt-table-parents-container">
                <table className="cpt-table-parents">
                    <thead>
                        <tr className="parents-and-states">
                            {[...parents, ...states].map((parentOrState, index) => (
                                <th key={index} className="cpt-parents-header">
                                    {parentOrState}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {cpt.map((entry, entryNumber) => (
                            <tr key={entryNumber} className="cpt-parents-row">
                                {Object.keys(entry.when).map((id, index) => (
                                    <td className="parent-state" key={index}>
                                        {entry.when[id]}
                                    </td>
                                ))}
                                {Object.keys(entry.then).map((state, index) => (
                                    <td className="node-probability" key={index}>
                                        <input
                                            key={states.length}
                                            className="node-probability-input"
                                            type="number"
                                            min="0.0"
                                            max="1.0"
                                            step="0.01"
                                            defaultValue={entry.then[state]}
                                            onChange={(event) =>
                                                handleOnChange(
                                                    state,
                                                    entryNumber,
                                                    event.target.valueAsNumber,
                                                    event.target
                                                )
                                            }
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <FaSave
                className="submit-parent-cpt"
                size="30px"
                onClick={handleOnSubmit}
                title="Save conditional probability table"
            />
        </div>
    );
};

export default NodeCPTWithParents;
