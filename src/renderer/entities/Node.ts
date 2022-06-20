// BayesJS types
import { ICptWithParents } from "bayesjs";
import { INodeData } from "../../shared/compute/bayesian-network";

// Gestures
import { ClickGesture, DragGesture, HoverGesture } from "../gestures";

// Interfaces
import IClickable from "../interfaces/IClickable";
import IDoubleClickable from "../interfaces/IDoubleClickable";
import IDraggable from "../interfaces/IDraggable";
import IHoverable from "../interfaces/IHoverable";
import IRenderable from "../interfaces/IRenderable";

// Utility functions
import isCyclic from "../util/GraphUtil";
import Vector2D from "../util/Vector2D";
import generateParentStateCombinations, { ParentAndStates } from "../util/Combinations";

// Edge entity
import Edge from "./Edge";

// Singletons
import WorldData from "../../shared/WorldData";
import EventBus from "../../shared/EventBus";
const worldData = WorldData.instance;
const eventBus = EventBus.instance;

export default class Node implements IRenderable, IClickable, IDoubleClickable, IDraggable, IHoverable {
    public selected = false;
    public dragging = false;
    public hovering = false;

    public zIndex = 1;
    public previousZIndex = 1;
    private dragStartPosition = new Vector2D(0, 0);

    public edges: Edge[] = [];

    private _name: string;

    public data: INodeData;

    constructor(public readonly id: number, private currentPosition: Vector2D, public r: number) {
        // Initialise name of the node
        this._name = `Node ${this.id}`;

        // Initialise node as a simple Bayesian node
        this.data = {
            name: this.name,
            id: this.id.toString(),
            states: ["True", "False"],
            parents: [],
            cpt: { True: 0.5, False: 0.5 },
            probabilities: { True: 0.5, False: 0.5 }
        };
    }

    public render(context: CanvasRenderingContext2D) {
        // Lower the opacity of the node if it is not in the current Markov blanket
        const markovBlanket = worldData.markovBlanket;
        if (markovBlanket.size > 0 && !markovBlanket.has(this.id)) {
            context.globalAlpha = 0.3;
        }

        // Draw the circle
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.r, 0, Math.PI * 2);
        context.fillStyle = "#36393f";
        if (this.selected) {
            context.save();
            context.globalAlpha = 0.5;
            context.strokeStyle = "blue";
            context.lineWidth = 6;
            context.lineCap = "round";
            context.stroke();
            context.restore();
        }
        context.fill();
        context.closePath();

        // Truncate the name of the node if it too long
        let name = this._name;
        if (context.measureText(name).width * window.devicePixelRatio > 40) {
            while (context.measureText(name).width * window.devicePixelRatio > 30)
                name = name.substring(0, name.length - 1);
            name += "...";
        }

        // Draw node name
        context.font = "12px Arial";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillText(name, this.position.x, this.position.y - this.r * 1.25);
    }

    public isInView(cameraPosition: Vector2D, canvasBounds: Vector2D, transformedOrigin: Vector2D): boolean {
        return (
            this.position.x + this.r + cameraPosition.x >= transformedOrigin.x &&
            this.position.y + this.r + cameraPosition.y >= transformedOrigin.y &&
            this.position.x - this.r + cameraPosition.x < transformedOrigin.x + canvasBounds.x &&
            this.position.y - this.r + cameraPosition.y < transformedOrigin.y + canvasBounds.y
        );
    }

    public isMouseOver(position: Vector2D): boolean {
        return (position.x - this.position.x) ** 2 + (position.y - this.position.y) ** 2 <= this.r ** 2;
    }

    public get parents(): Node[] {
        return this.edges.filter((edge) => edge.from !== this).map((edge) => edge.from);
    }

    public get parentNames(): string[] {
        return this.parents.map((parent) => parent.name);
    }

    public hasParents(): boolean {
        return this.parents.length > 0;
    }

    public get children(): Node[] {
        return this.edges.filter((edge) => edge.to && edge.to !== this).map((edge) => edge.to!);
    }

    public hasChildren(): boolean {
        return this.children.length > 0;
    }

    public get position(): Vector2D {
        return this.currentPosition;
    }

    public get name() {
        return this._name;
    }

    public set name(newName: string) {
        // Do not set a new name if the name provided is empty
        if (newName.length === 0) return;

        // Update node name
        this._name = newName;
        this.data.name = newName;
    }

    public onClick(clickGesture: ClickGesture) {
        if (clickGesture.world.edgeBeingCreated) {
            // Retrieve the current edge being created
            const edge = clickGesture.world.edgeBeingCreated;

            // Update edge data
            edge.to = this;
            edge.zIndex = 0;
            edge.from.zIndex = edge.from.previousZIndex;
            this.edges.push(edge);

            // Don't allow to create edge if it creates a cycle in the network
            if (edge.from.id === this.id || isCyclic(clickGesture.world.nodes)) clickGesture.world.undo();

            // Update parents in the data
            this.data.parents.push(edge.from.id.toString());

            // Update node cpt to account for parents
            this.refreshCPT();

            return;
        }

        if (clickGesture.shift) {
            const edge = clickGesture.world.createEdge(this);
            edge.zIndex = Number.MAX_SAFE_INTEGER - 1;
            this.previousZIndex = this.zIndex;
            this.zIndex = Number.MAX_SAFE_INTEGER;
            this.edges.push(edge);
            return;
        }

        this.selected = !this.selected;

        if (!clickGesture.alt) clickGesture.world.deselectAllClickables(this.id);
    }

    public onDoubleClick(clickGesture: ClickGesture) {
        eventBus.emit("toggleNodeInformation", this);
    }

    public onDragStart(dragGesture: DragGesture) {
        this.dragging = true;
        this.dragStartPosition = new Vector2D(
            dragGesture.position.x - this.currentPosition.x,
            dragGesture.position.y - this.currentPosition.y
        );
    }

    public onDrag(dragGesture: DragGesture) {
        this.zIndex = dragGesture.zIndex || this.zIndex;
        this.currentPosition = new Vector2D(
            dragGesture.position.x - this.dragStartPosition.x,
            dragGesture.position.y - this.dragStartPosition.y
        );
    }

    public onDragEnd(dragGesture: DragGesture) {
        this.dragging = false;
        this.zIndex = dragGesture.zIndex || this.zIndex;
    }

    public onEnterHover(hoverGesture: HoverGesture) {
        // Do not call hover events if we are currently creating an edge
        if (hoverGesture.world.edgeBeingCreated) return;

        this.hovering = true;

        // Get this nodes Markov blanket
        hoverGesture.world.setMarkovBlanket(this);
    }

    public onExitHover(hoverGesture: HoverGesture) {
        this.hovering = false;

        // Clear the current Markov blanket
        hoverGesture.world.clearMarkovBlanket();
    }

    public refreshCPT() {
        // If node has no more parents left, just set its cpt to the current state probabilities
        if (!this.hasParents()) {
            this.data.cpt = { ...this.data.probabilities };
            return;
        }

        // If node does have parents, update the cpt so that it includes all possible parent state combinations
        // Retrieve all parents and their states
        const parents = this.parents.map((parent) => parent.data as ParentAndStates);

        // Get all possible state combinations
        const stateCombinations = generateParentStateCombinations(parents);

        // If this is the first parent
        if (this.parents.length === 1) {
            this.data.cpt = stateCombinations.map((combination) => {
                return { when: combination, then: { ...this.data.probabilities } };
            });
        }

        // Otherwise
        this.data.cpt = stateCombinations.map((combination, index) => {
            return {
                when: combination,
                then: { ...(this.data.cpt as ICptWithParents)[index % this.data.cpt.length].then }
            };
        });
    }
}
