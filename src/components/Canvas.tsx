import { useEffect, useRef } from "react";

const Canvas = () => {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(
		() => {
			const canvas = canvasRef.current;
		},
		[]
	);

	return (
		<canvas ref={canvasRef} />
	);
};

export default Canvas;