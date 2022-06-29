import {
    isClickable,
    isDoubleClickable,
    isDraggable,
    isHoverable,
    isRenderable
} from "../../../src/renderer/util/TypeGuard";

describe("type guard", () => {
    test("TypeGuard correctly identifies interfaces", () => {
        // Create mock objects
        const renderable = {
            id: 1,
            isInView: () => {
                /** TEST */
            },
            render: () => {
                /** TEST */
            }
        };

        const clickable = {
            selected: false,
            onClick: () => {
                /** TEST */
            }
        };

        const doubleClickable = {
            onDoubleClick: () => {
                /** TEST */
            }
        };

        const draggable = {
            dragging: false,
            onDrag: () => {
                /** TEST */
            },
            onDragEnd: () => {
                /** TEST */
            },
            onDragStart: () => {
                /** TEST */
            }
        };

        const hoverable = {
            hovering: false,
            onEnterHover: () => {
                /** TEST */
            },
            onExitHover: () => {
                /** TEST */
            }
        };

        // An invalid interface that the type guards should reject
        const notAValidInterface = {
            test: "test"
        };

        // Type guards should accept these
        expect(isRenderable(renderable)).toBe(true);
        expect(isClickable(clickable)).toBe(true);
        expect(isDoubleClickable(doubleClickable)).toBe(true);
        expect(isDraggable(draggable)).toBe(true);
        expect(isHoverable(hoverable)).toBe(true);

        // Type guards should reject these
        expect(isRenderable(notAValidInterface)).toBe(false);
        expect(isClickable(notAValidInterface)).toBe(false);
        expect(isDoubleClickable(notAValidInterface)).toBe(false);
        expect(isDraggable(notAValidInterface)).toBe(false);
        expect(isHoverable(notAValidInterface)).toBe(false);
    });
});
