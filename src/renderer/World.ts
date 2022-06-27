import BayesianNetwork from "../shared/compute/bayesian-network";
import EventBus, { NetworkEvent } from "../shared/EventBus";
import Board from "./entities/Board";
import Edge from "./entities/Edge";
import Node from "./entities/Node";
import IClickable from "./interfaces/IClickable";
import IDoubleClickable from "./interfaces/IDoubleClickable";
import IDraggable from "./interfaces/IDraggable";
import IEntity from "./interfaces/IEntity";
import IHoverable from "./interfaces/IHoverable";
import IInteractable from "./interfaces/IInteractable";
import IRenderable from "./interfaces/IRenderable";
import { isClickable, isDoubleClickable, isDraggable, isHoverable, isRenderable } from "./util/TypeGuard";
import Vector2D from "./util/Vector2D";

const eventBus = EventBus.instance;
export default class World {
    public entities: IEntity[] = [];
    private recentlyCreatedEntities: IEntity[] = [];

    public markovBlanket: Set<number | undefined> = new Set();
    public bayesianNetwork: BayesianNetwork = new BayesianNetwork();

    constructor(public readonly board: Board) {}

    public addEntity(entity: IEntity) {
        // Add entity to entity array and to recent entities for undo ability
        this.entities.push(entity);
        this.recentlyCreatedEntities.push(entity);
    }

    public removeEntity(entity: IEntity) {
        if (entity instanceof Node) {
            const node = entity as Node;

            // Remove each edge of the node
            node.edges.forEach((edge) => this.removeEntity(edge));

            // Remove node from Bayesian network
            this.bayesianNetwork.removeNode(node.id.toString());

            // Remove evidence from network if it was selected for this node
            this.bayesianNetwork.removeEvidence(node.id.toString());

            // Send message to frontend
            eventBus.emit(NetworkEvent.NODE_DELETED);
        }

        if (entity instanceof Edge) {
            const edge = entity as Edge;
            if (edge.to) {
                // Remove edge from child node
                edge.to.edges = edge.to.edges.filter((_edge) => _edge.id !== edge.id);

                // Remove parent from child data
                edge.to.data.parents = edge.to.data.parents.filter((id) => id !== edge.from.id.toString());

                // Revert child node cpt back to one without parents if it has no more parents
                edge.to.refreshCPT();
            }

            // Remove edge from parent node
            edge.from.edges = edge.from.edges.filter((_edge) => _edge.id !== edge.id);

            // Send message to frontend
            eventBus.emit(NetworkEvent.EDGE_DELTED);
        }

        // Remove edge from entities and recently created entities
        this.entities = this.entities.filter((_entity) => _entity.id !== entity.id);
        this.recentlyCreatedEntities = this.recentlyCreatedEntities.filter((_entity) => _entity.id !== entity.id);

        // Reset the Markov blanket
        this.markovBlanket = new Set();

        // Save current network
        eventBus.emit(NetworkEvent.SAVE_NETWORK);
    }

    public get renderables(): IRenderable[] {
        return this.entities.filter(isRenderable);
    }

    public get renderablesSize(): number {
        return this.renderables.length;
    }

    public get interactables(): IInteractable[] {
        return this.entities.filter(isClickable || isDoubleClickable || isDraggable || isHoverable);
    }

    public get interactablesSize(): number {
        return this.interactables.length;
    }

    public get clickables(): IClickable[] {
        return this.entities.filter(isClickable);
    }

    public get clickablesSize(): number {
        return this.clickables.length;
    }

    public get doubleClickables(): IDoubleClickable[] {
        return this.entities.filter(isDoubleClickable);
    }

    public get doubleClickablesSize(): number {
        return this.doubleClickables.length;
    }

    public get hoverables(): IHoverable[] {
        return this.entities.filter(isHoverable);
    }

    public get hoverablesSize(): number {
        return this.hoverables.length;
    }

    public get draggables(): IDraggable[] {
        return this.entities.filter(isDraggable);
    }

    public get draggablesSize(): number {
        return this.draggables.length;
    }

    public get renderablesInView(): IRenderable[] {
        return this.renderables.filter((renderable) =>
            renderable.isInView(
                this.board.camera.position,
                this.board.camera.bounds,
                this.board.camera.transformedOrigin
            )
        );
    }

    public get interactablesInView(): IInteractable[] {
        return (<unknown>(
            this.renderablesInView.filter(isClickable || isDoubleClickable || isDraggable || isHoverable)
        )) as IInteractable[];
    }

    public get clickablesInView(): IClickable[] {
        return (<unknown>this.renderablesInView.filter(isClickable)) as IClickable[];
    }

    public get doubleClickablesInView(): IDoubleClickable[] {
        return (<unknown>this.renderablesInView.filter(isDoubleClickable)) as IDoubleClickable[];
    }

    public get hoverablesInView(): IHoverable[] {
        return (<unknown>this.renderablesInView.filter(isHoverable)) as IHoverable[];
    }

    public get draggablesInView(): IDraggable[] {
        return (<unknown>this.renderablesInView.filter(isDraggable)) as IDraggable[];
    }

    public get nodes(): Node[] {
        return this.entities.filter((entity) => entity instanceof Node).sort((a, b) => a.id - b.id) as Node[];
    }

    public get edges(): Edge[] {
        return this.entities.filter((entity) => entity instanceof Edge) as Edge[];
    }

    public get currentlySelectedClickables(): IClickable[] {
        return this.clickables.filter((clickable) => clickable.selected);
    }

    public get currentlyHoveringOver(): IHoverable | undefined {
        return this.hoverables.find((hoverable) => hoverable.hovering);
    }

    public get currentlyDragging(): IDraggable | undefined {
        return this.draggables.find((draggable) => draggable.dragging);
    }

    public get edgeBeingCreated(): Edge | undefined {
        return this.edges.find((edge) => !edge.to);
    }

    public get numberOfClickablesSelected(): number {
        return this.clickables.filter((clickable) => clickable.selected).length;
    }

    public get numberOfNodes() {
        return this.entities.filter((entity) => entity instanceof Node).length;
    }

    public get numberOfEdges() {
        return this.entities.filter((entity) => entity instanceof Edge).length;
    }

    public deselectAllClickables(omit?: number) {
        this.clickables.forEach((clickable) => {
            if (omit !== clickable.id) clickable.selected = false;
        });
    }

    public selectAllClickables() {
        this.clickables.forEach((clickable) => (clickable.selected = true));
    }

    public removeAllSelectedClickables() {
        // Remove nodes first as edges get removed with nodes
        this.clickables
            .filter((clickable) => clickable.selected && clickable instanceof Node)
            .forEach((clickable) => this.removeEntity(clickable));

        // Removing remaning edges
        this.clickables
            .filter((clickable) => clickable.selected && clickable instanceof Edge)
            .forEach((clickable) => this.removeEntity(clickable));
    }

    public createNode(coords: Vector2D) {
        // Create new node
        const node = new Node(this.entities.length + 1, coords, 30);

        // Add node to rendering world
        this.addEntity(node);

        // Add node to Bayesian network
        this.bayesianNetwork.addNode(node.id.toString(), node.data);

        // Let frontend know that a node has been created
        eventBus.emit(NetworkEvent.NODE_CREATED);

        // Save current network
        eventBus.emit(NetworkEvent.SAVE_NETWORK);

        // Return newly created node
        return node;
    }

    public createEdge(from: Node) {
        const edge = new Edge(this.entities.length + 1, 10, from, from.position);
        this.addEntity(edge);

        eventBus.emit(NetworkEvent.EDGE_CREATED);

        return edge;
    }

    public undo() {
        const entity = this.recentlyCreatedEntities.pop();
        if (entity) this.removeEntity(entity);
    }

    public setMarkovBlanket(node: Node) {
        // Get all the nodes in the Markov blanket
        const parents = node.parents.map((parent) => parent.id);
        const children = node.children.map((child) => child.id);
        const childrensParents = node.children.flatMap((child) => child.parents.map((parent) => parent.id));

        // Get all the edges in the Markov blanket
        const edges = node.edges.map((edge) => edge.id);
        const childrensParentsEdges = node.children.flatMap((child) =>
            this.edges.filter((edge) => edge.to?.id === child.id).map((edge) => edge.id)
        );

        // Create Markov blanket set
        this.markovBlanket = new Set([
            node.id,
            ...parents,
            ...children,
            ...childrensParents,
            ...edges,
            ...childrensParentsEdges
        ]);
    }

    public clearMarkovBlanket() {
        // Set Markov blanket to empty set
        this.markovBlanket = new Set();
    }
}
