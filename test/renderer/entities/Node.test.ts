import Node from "../../../src/renderer/entities/Node";
import Vector2D from "../../../src/renderer/util/Vector2D";

describe("node", () => {
    let node: Node;
    beforeEach(() => {
        node = new Node(1, new Vector2D(10, 10), 10);
    });

    test("returns correct name", () => {
        expect(node.name).toBe("Node 1");
    });

    test("can set name on node", () => {
        node.name = "Test";
        expect(node.name).toBe("Test");
    });

    test("isMouseOver works correctly", () => {
        let position = new Vector2D(5, 5);
        expect(node.isMouseOver(position)).toBeTruthy();

        position = new Vector2D(20, 20);
        expect(node.isMouseOver(position)).toBeFalsy();
    });

    test("has correct properties", () => {
        expect(node.hasParents()).toBeFalsy();
        expect(node.hasChildren()).toBeFalsy();
        expect(node.children).toStrictEqual([]);
        expect(node.parents).toStrictEqual([]);
    });
});
