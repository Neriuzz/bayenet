import { useRef, useState } from "react";

// Icons
import { FaSave } from "react-icons/fa";

// Types
import { ICptWithoutParents, ICptWithParents } from "bayesjs";

// Styles
import "./NodeCPTWithoutParents.scss";

// For precise arithmetic
import { mathExact } from "math-exact";

// Component props
export interface NodeCPTWithoutParentsProps {
    cpt: ICptWithoutParents;
    updateCPT: (newCpt: ICptWithParents | ICptWithoutParents) => void;
}

const NodeCPTWithoutParents = ({ cpt, updateCPT }: NodeCPTWithoutParentsProps) => {
    const [allowSubmit, setAllowSubmit] = useState(false);

    // Use a copy to temporarily store changes to the cpt
    const cptCopy = useRef<ICptWithoutParents>({ ...cpt });

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
        const sumOfAllStates = otherStates.reduce((acc, state) => mathExact("Add", acc, cptCopy.current[state]), value);

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
                            {Object.keys(cpt).map((state, index) => (
                                <td className="table-probability" key={index}>
                                    <input
                                        className="probability-input"
                                        type="number"
                                        defaultValue={cpt[state]}
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
