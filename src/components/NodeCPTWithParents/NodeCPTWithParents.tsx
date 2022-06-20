import { useRef, useState } from "react";

// Types
import { ICptWithoutParents, ICptWithParents } from "bayesjs";

// Icons
import { FaSave } from "react-icons/fa";

// Styles
import "./NodeCPTWithParents.scss";

// Component props
export interface NodeCPTWithParentsProps {
    cpt: ICptWithParents;
    parents: string[];
    states: string[];
    updateCPT: (newCpt: ICptWithParents | ICptWithoutParents) => void;
}

const NodeCPTWithParents = ({ cpt, parents, states, updateCPT }: NodeCPTWithParentsProps) => {
    const [allowSubmit, setAllowSubmit] = useState(false);
    const cptCopy = useRef({ ...cpt });

    const handleOnSubmit = () => {
        if (allowSubmit) updateCPT(cptCopy.current);
    };

    const handleOnChange = () => {
        console.log("weed");
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
                                            className="node-probability-input"
                                            type="number"
                                            min="0.0"
                                            max="1.0"
                                            step="0.01"
                                            defaultValue={entry.then[state]}
                                            onChange={(event) => handleOnChange()}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
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

export default NodeCPTWithParents;
