import Vector2D from "../../../src/renderer/util/Vector2D";

describe("position", () => {
    const position = new Vector2D(10, 15);

    test("Has correct x coordinate", () => {
        expect(position.x).toBe(10);
    });

    test("Has correct y coordinate", () => {
        expect(position.y).toBe(15);
    });
});
