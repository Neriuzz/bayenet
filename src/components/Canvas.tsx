import Renderer from "@/renderer/Renderer";
import "@styles/Canvas.scss";
import { useEffect, useRef } from "react";

const Canvas = () => {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);

	useEffect(
		() => {
			canvasRef.current?.focus();
			contextRef.current = canvasRef.current?.getContext("2d");

			if (canvasRef.current && contextRef.current) {
				// Instantiate the renderer
				new Renderer(canvasRef.current, contextRef.current);
			} else {
				console.log("Something went terribly wrong!");
			}
		},
		[]
	);
	
	return (
		<canvas ref={canvasRef} tabIndex={1} onClick={() => canvasRef.current?.focus()}/>
	);
};

export default Canvas;