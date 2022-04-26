import Renderer from "../renderer/Renderer";
import "../styles/Canvas.scss";
import { useEffect, useRef } from "react";

const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null!);

	useEffect(() => {
		// Focus the canvas and retrieve 2D context.
		canvasRef.current.focus();
		const context = canvasRef.current.getContext("2d")!;

		// Spawn a new renderer.
		new Renderer(canvasRef.current, context);
	}, []);

	return <canvas ref={canvasRef} tabIndex={1} onClick={() => canvasRef.current.focus()} />;
};

export default Canvas;
