import Edge from "../../../src/renderer/entities/Edge";
import Node from "../../../src/renderer/entities/Node";
import Vector2D from "../../../src/renderer/util/Vector2D";

describe("edge", () => {
    let edge: Edge;
    beforeEach(() => {
        const fromNode = new Node(1, new Vector2D(0, 0), 0);
        const toNode = new Node(2, new Vector2D(10, 0), 0);

        edge = new Edge(3, 10, fromNode, new Vector2D(0, 0), toNode);
    });

    test("isMouseOver works correctly", () => {
        let position = new Vector2D(5, 1);
        expect(edge.isMouseOver(position)).toBeTruthy();

        position = new Vector2D(11, 0);
        expect(edge.isMouseOver(position)).toBeFalsy();
    });
});
