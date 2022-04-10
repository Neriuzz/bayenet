import Vector2D from "../util/Vector2D";
import World from "../World";

export type ClickGesture = {
	position: Vector2D;
	alt: boolean;
	shift: boolean;
	world: World;
};

export type DragGesture = {
	position: Vector2D;
	zIndex?: number;
};

export type HoverGesture = {
};
