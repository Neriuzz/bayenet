import generateParentStateCombinations from "../../../src/renderer/util/Combinations";

describe("generateParentStateCombinations", () => {
    test("works with empty input", () => {
        expect(generateParentStateCombinations([])).toStrictEqual([]);
    });

    test("correctly generates parent state combinations", () => {
        const parentsAndStates = [
            { id: "1", states: ["True", "False", "Other"] },
            { id: "2", states: ["True", "False", "Other"] }
        ];
        const expectedResult = [
            {
                "1": "True",
                "2": "True"
            },
            {
                "1": "False",
                "2": "True"
            },
            {
                "1": "Other",
                "2": "True"
            },
            {
                "1": "True",
                "2": "False"
            },
            {
                "1": "False",
                "2": "False"
            },
            {
                "1": "Other",
                "2": "False"
            },
            {
                "1": "True",
                "2": "Other"
            },
            {
                "1": "False",
                "2": "Other"
            },
            {
                "1": "Other",
                "2": "Other"
            }
        ];

        expect(generateParentStateCombinations(parentsAndStates)).toStrictEqual(expectedResult);
    });

    test("works with parents that don't have the same number of states", () => {
        const parentsAndStates = [
            { id: "1", states: ["True", "False", "Other"] },
            { id: "2", states: ["True", "False"] }
        ];

        const expectedResult = [
            {
                "1": "True",
                "2": "True"
            },
            {
                "1": "False",
                "2": "True"
            },
            {
                "1": "Other",
                "2": "True"
            },
            {
                "1": "True",
                "2": "False"
            },
            {
                "1": "False",
                "2": "False"
            },
            {
                "1": "Other",
                "2": "False"
            }
        ];

        expect(generateParentStateCombinations(parentsAndStates)).toStrictEqual(expectedResult);
    });

    test("output matches expected length", () => {
        const parentsAndStates = [
            { id: "1", states: ["True", "False", "Other"] },
            { id: "2", states: ["True", "False"] },
            { id: "3", states: ["True", "False", "Other", "Another"] }
        ];

        expect(generateParentStateCombinations(parentsAndStates).length).toBe(24);
    });

    test("works with a single parents", () => {
        const parentsAndStates = [{ id: "1", states: ["True", "False"] }];
        const expectedResult = [{ "1": "True" }, { "1": "False" }];

        expect(generateParentStateCombinations(parentsAndStates)).toStrictEqual(expectedResult);
    });
});
