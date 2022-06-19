// Implementation adapted from https://github.com/bayesjs/bayesjs-editor/blob/master/src/utils/combinations.js

// Functional programming library, useful for mutating lists and arrays
import { flip, apply, flatten, length, liftN, mergeAll, pipe, unapply } from "ramda";

// Defines the type this util functions expect to recieve
export interface ParentAndStates {
    id: string;
    states: string[];
}

/**
 * Generates a key-value pair object
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
 * Generates state combinations for a specific parent node
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
 * Generates all possible combinations of parent states
 *
 * @param parents List of all parent nodes
 * @returns Returns all possible combinations of parent states, which is then used in the conditional probability table
 */
export default function generateParentStateCombinations(parents: ParentAndStates[]) {
    // Get all the possible state combinations for each parent
    const parentCombinations = parents.map(createCombinationsForParent);

    // Function to combine all possible state combinations into one object
    const combineAllCombinations = pipe(length, flip(liftN)(unapply(mergeAll)))(parentCombinations);

    // Run the combineAllCombinations function and return result
    return flatten(apply(combineAllCombinations, parentCombinations as [arg: unknown]));
}
