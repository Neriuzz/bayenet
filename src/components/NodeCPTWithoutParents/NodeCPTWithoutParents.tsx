// Types
import { ICptWithoutParents } from "bayesjs";

// Styles
import "./NodeCPTWithoutParents.scss";

// Component props
export interface NodeCPTWithoutParentsProps {
    cpt: ICptWithoutParents;
}

const NodeCPTWithoutParents = ({ cpt }: NodeCPTWithoutParentsProps) => {
    return (
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
                            {cpt[state]}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    );
};

export default NodeCPTWithoutParents;
