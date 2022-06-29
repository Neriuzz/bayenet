/* eslint-disable @typescript-eslint/no-unused-vars */
import { mock } from "jest-mock-extended";
import Board from "../../src/renderer/entities/Board";
import IClickable from "../../src/renderer/interfaces/IClickable";
import Vector2D from "../../src/renderer/util/Vector2D";
import World from "../../src/renderer/World";

describe("world", () => {
    const position = new Vector2D(0, 0);
    let world: World;
    beforeEach(() => {
        const canvas = mock<HTMLCanvasElement>();
        canvas.width = 200;
        canvas.height = 200;
        const context = canvas.getContext("2d");

        world = new World(new Board(canvas, context!));
    });

    test("adds nodes correctly", () => {
        world.createNode(position);
        expect(world.numberOfNodes).toBe(1);
    });

    test("removes nodes correctly", () => {
        const node = world.createNode(position);
        world.removeEntity(node);

        expect(world.numberOfNodes).toBe(0);
    });

    test("adds edges correctly", () => {
        const node = world.createNode(position);
        world.createEdge(node);

        expect(world.numberOfEdges).toBe(1);
    });

    test("removes edges correctly", () => {
        const node = world.createNode(position);
        const edge = world.createEdge(node);
        world.removeEntity(edge);

        expect(world.numberOfEdges).toBe(0);
    });

    test("retrieves selected clickables", () => {
        const node = world.createNode(position);
        const edge = world.createEdge(node);
        world.selectAllClickables();

        expect(world.currentlySelectedClickables).toStrictEqual([node as IClickable, edge as IClickable]);
        expect(world.numberOfClickablesSelected).toBe(2);
    });

    test("retrieves entities by interface correctly", () => {
        const node = world.createNode(position);
        const edge = world.createEdge(node);
        expect(world.doubleClickablesSize).toBe(1);
        expect(world.doubleClickables).not.toContain(edge);
    });

    test("removing all clickables works correctly", () => {
        const node1 = world.createNode(position);
        const node2 = world.createNode(position);
        const node3 = world.createNode(position);
        const node4 = world.createNode(position);

        world.selectAllClickables();
        world.removeAllSelectedClickables();
        expect(world.entities.length).toBe(0);
    });

    test("undo works correctly", () => {
        const node1 = world.createNode(position);
        world.undo();

        expect(world.nodes).not.toContain(node1);
    });

    test("getting the current entity being dragged works correctly", () => {
        const node1 = world.createNode(position);
        const node2 = world.createNode(position);

        node1.dragging = true;

        expect(world.currentlyDragging).toBe(node1);
    });

    test("getting all renderables in view works correctly", () => {
        const node1 = world.createNode(position);
        const node2 = world.createNode(position);
        const edge = world.createEdge(node1);
        edge.to = node2;
        node2.edges.push(edge);

        const node3 = world.createNode(new Vector2D(10000, 10000));

        expect(world.renderablesInView).toContain(node1);
        expect(world.renderablesInView).toContain(node2);
        expect(world.renderablesInView).toContain(edge);
        expect(world.renderablesInView).not.toContain(node3);
    });

    test("getting edge being created works correctly", () => {
        const node = world.createNode(position);
        const edge = world.createEdge(node);

        expect(world.edgeBeingCreated).toBe(edge);
    });
});
