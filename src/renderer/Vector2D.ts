export default class Vector2D {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public offset(offset: Vector2D) {
		this.x -= offset.x;
		this.y -= offset.y;
	}
}