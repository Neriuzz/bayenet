import { useEffect, useRef } from "react";
import { MdZoomOutMap } from "react-icons/md";

import "./Canvas.scss";

import Renderer from "../../renderer/Renderer";
import EventBus from "../../shared/EventBus";

const eventBus = EventBus.instance;

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const resetCameraZoom = () => {
        eventBus.emit("resetCameraZoom");
    };

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

    return (
        <>
            <MdZoomOutMap className="reset-zoom-icon" size="30px" onClick={resetCameraZoom} />
            <canvas ref={canvasRef} tabIndex={1} onClick={() => canvasRef.current?.focus()} />
        </>
    );
};

export default Canvas;
