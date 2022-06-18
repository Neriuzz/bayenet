import { ICptWithoutParents, ICptWithParents } from "bayesjs";

export interface StateProbabilities {
    [key: string]: number;
}

export default class BayesianNode {
    public states: string[];
    public cpt: ICptWithParents | ICptWithoutParents;
    public stateProbabilities: StateProbabilities;

    constructor(public name: string, public id: string, public parents: string[]) {
        // Initialise the Bayesian node as a simple two-state node
        this.states = ["True", "False"];
        this.stateProbabilities = { True: 1, False: 0.5 };
        this.cpt = { True: 0.5, False: 0.5 };
    }

    public hasParents() {
        return this.parents.length > 0;
    }
}
