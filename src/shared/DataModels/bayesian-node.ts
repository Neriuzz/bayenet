export default class BayesianNode {
    public states: string[];

    constructor(public id: number, public parents: number[]) {
        this.states = ["True", "False"];
    }
}
