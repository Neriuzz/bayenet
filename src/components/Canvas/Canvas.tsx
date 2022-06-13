import { useEffect, useRef } from "react";

import "./Canvas.scss";

import Renderer from "../../renderer/Renderer";

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Run when component mounts
    useEffect(() => {
        // Focus the canvas and retrieve 2D context.
        if (canvasRef.current) {
            canvasRef.current.focus();
            const context = canvasRef.current.getContext("2d");

            // Spawn a new renderer.
            if (context) {
                new Renderer(canvasRef.current, context);
            }
        }
    }, []);

    return <canvas ref={canvasRef} tabIndex={1} onClick={() => canvasRef.current?.focus()} />;
};

export default Canvas;
