import Edge from "../renderer/entities/Edge";
import Node from "../renderer/entities/Node";
import World from "../renderer/World";

export default class WorldAPI {
    private static _instance: WorldAPI;

    private world: World | null = null;

    private constructor() {}

    public static get instance(): WorldAPI {
        if (!WorldAPI._instance) WorldAPI._instance = new WorldAPI();

        return WorldAPI._instance;
    }

    public registerWorld(world: World) {
        this.world = world;
    }

    public numberOfNodes() {
        return this.world?.entities.filter((entity) => entity instanceof Node).length;
    }

    public numberOfEdges() {
        return this.world?.entities.filter((entity) => entity instanceof Edge).length;
    }
}
