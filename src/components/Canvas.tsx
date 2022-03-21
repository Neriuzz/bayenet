import Renderer from "@/renderer/Renderer";
import "@styles/Canvas.scss";
import { useEffect, useRef } from "react";

const Canvas = () => {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);
	const rendererRef = useRef<Renderer | null>(null);

	useEffect(
		() => {
			canvasRef.current?.focus();
			contextRef.current = canvasRef.current?.getContext("2d");

			if (canvasRef.current && contextRef.current) {
				// TODO: Register canvas and context with renderer, register event listeners
				rendererRef.current = new Renderer(canvasRef.current, contextRef.current);
			} else {
				console.log("Something went terribly wrong");
			}
		},
		[]
	);
	
	return (
		<canvas ref={canvasRef} tabIndex={0} />
	);
};

export default Canvas;