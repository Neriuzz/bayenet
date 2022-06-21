// Implementation adapted from https://github.com/bayesjs/bayesjs-editor/blob/master/src/utils/combinations.js

// Functional programming library, useful for mutating lists and arrays
import { flip, apply, flatten, length, liftN, mergeAll, pipe, unapply } from "ramda";

// Defines the type this util functions expect to recieve
export interface ParentAndStates {
    id: string;
    states: string[];
}

interface Combination {
    [key: string]: string;
}

/**
 * @description Generates a key-value pair object
 *
 * @param key The provided key.
 * @param value The provided value.
 * @returns And object of the type { key: value }
 */
function generateKeyValuePair(key: string, value: string): Record<string, string> {
    const pair: Record<string, string> = {};
    pair[key] = value;
    return pair;
}

/**
 * @description Generates state combinations for a specific parent node
 *
 * @param parent The parent node to generate state combinations for
 * @returns An object containing all possible states
 */
function createCombinationsForParent(parent: ParentAndStates): Record<string, string>[] {
    return parent.states.reduce(
        (acc, state) => [...acc, generateKeyValuePair(parent.id, state)],
        [] as Record<string, string>[]
    );
}

/**
 * @description Generates all possible combinations of parent states
 *
 * @param parents List of all parent nodes
 * @returns Returns all possible combinations of parent states, which is then used in the conditional probability table
 */
export default function generateParentStateCombinations(parents: ParentAndStates[]) {
    // Get all the possible state combinations for each parent
    const parentCombinations = parents.map(createCombinationsForParent);

    // Function to combine all possible state combinations into one object
    const combineAllCombinations = pipe(length, flip(liftN)(unapply(mergeAll)))(parentCombinations);

    // Run the combineAllCombinations function and get result
    const result: Combination[] = flatten(apply(combineAllCombinations, parentCombinations as [arg: unknown]));

    // Order the results
    const orderedResult: Combination[] = [];

    // Get length of combinations
    const combinationLength = result.length;

    // Get number of states for first parents
    const firstParentNumberOfStates = parents[0].states.length;

    // Get number of iterations
    const iterations = combinationLength / firstParentNumberOfStates;

    // Generate initial indices
    let indices = [...parents[0].states.map((_, index) => index * iterations)];

    // Order the array so that we go through the first parents state combinations first
    for (let i = 0; i < iterations; i++) {
        indices.forEach((index) => orderedResult.push(result[index]));
        indices = [...indices.map((index) => index + 1)];
    }

    // Return the ordered result
    return orderedResult;
}
