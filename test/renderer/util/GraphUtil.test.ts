import Edge from "../../../src/renderer/entities/Edge";
import Node from "../../../src/renderer/entities/Node";
import isCyclic from "../../../src/renderer/util/GraphUtil";
import Vector2D from "../../../src/renderer/util/Vector2D";

describe("isCyclic", () => {
    test("works with empty networks", () => {
        expect(isCyclic([])).toBe(false);
    });

    test("correctly identifies cyclic networks", () => {
        // Create test position
        const position = new Vector2D(0, 0);

        // Create test nodes
        const node1 = new Node(1, position, 0);
        const node2 = new Node(2, position, 0);
        const node3 = new Node(3, position, 0);

        // Create test edges
        const edge1 = new Edge(4, 0, node1, position, node2);
        const edge2 = new Edge(5, 0, node2, position, node3);
        const edge3 = new Edge(6, 0, node3, position, node1);

        // Link test nodes with test edges
        node1.edges.push(edge1, edge3);
        node2.edges.push(edge1, edge2);
        node3.edges.push(edge2, edge3);

        // Run test
        expect(isCyclic([node1, node2, node3])).toBe(true);
    });

    test("correctly identifies non-cyclic networks", () => {
        // Create test position
        const position = new Vector2D(0, 0);

        // Create test nodes
        const node1 = new Node(1, position, 0);
        const node2 = new Node(2, position, 0);
        const node3 = new Node(3, position, 0);

        // Create test edges
        const edge1 = new Edge(4, 0, node1, position, node2);
        const edge2 = new Edge(5, 0, node2, position, node3);

        // Link test nodes with test edges
        node1.edges.push(edge1);
        node2.edges.push(edge1, edge2);
        node3.edges.push(edge2);

        // Run test
        expect(isCyclic([node1, node2, node3])).toBe(false);
    });

    test("correctly identifies cyclic network between two nodes", () => {
        // Create test position
        const position = new Vector2D(0, 0);

        // Create test nodes
        const node1 = new Node(1, position, 0);
        const node2 = new Node(2, position, 0);

        // Create test edges
        const edge1 = new Edge(3, 0, node1, position, node2);
        const edge2 = new Edge(4, 0, node2, position, node1);

        // Link test nodes with test edges
        node1.edges.push(edge1, edge2);
        node2.edges.push(edge2, edge1);

        // Run test
        expect(isCyclic([node1, node2])).toBe(true);
    });

    test("works with no edges in the network", () => {
        // Create test position
        const position = new Vector2D(0, 0);

        // Create test nodes
        const node1 = new Node(1, position, 0);
        const node2 = new Node(2, position, 0);
        const node3 = new Node(3, position, 0);

        // Run test
        expect(isCyclic([node1, node2, node3])).toBe(false);
    });
});
