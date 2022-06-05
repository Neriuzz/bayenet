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

export default class World {
    private nextID = 0;

    public entities: IEntity[] = [];
    private recentlyCreatedEntities: IEntity[] = [];

    constructor(public readonly board: Board) {}

    public addEntity(entity: IEntity) {
        this.entities.push(entity);
        this.recentlyCreatedEntities.push(entity);
    }

    public removeEntity(entity: IEntity) {
        if (entity instanceof Node) {
            const node = entity as Node;
            node.edges.forEach((edge) => this.removeEntity(edge));
        }

        if (entity instanceof Edge) {
            const edge = entity as Edge;
            edge.from.edges = edge.from.edges.filter((_edge) => _edge.id !== edge.id);
            if (edge.to) edge.to.edges = edge.to.edges.filter((_edge) => _edge.id !== edge.id);
        }

        this.entities = this.entities.filter((_entity) => _entity.id !== entity.id);
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
            renderable.isInView(this.board.camera.position, this.board.camera.bounds)
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

    public deselectAllClickables(omit?: number) {
        this.clickables.forEach((clickable) => {
            if (omit !== clickable.id) clickable.selected = false;
        });
    }

    public selectAllClickables() {
        this.clickables.forEach((clickable) => (clickable.selected = true));
    }

    public removeAllSelectedClickables() {
        this.clickables.filter((clickable) => clickable.selected).forEach((clickable) => this.removeEntity(clickable));
    }

    public createNode(coords: Vector2D) {
        const node = new Node(this.nextID++, coords, 30);
        this.addEntity(node);
        return node;
    }

    public createEdge(from: Node) {
        const edge = new Edge(this.nextID++, 10, from, from.position);
        this.addEntity(edge);
        return edge;
    }

    public undo() {
        const entity = this.recentlyCreatedEntities.pop();
        if (entity) this.removeEntity(entity);
    }
}
