import World from "../renderer/World";

export default class WorldData {
    private static _instance: WorldData;
    private world: World | null = null;

    public static get instance(): WorldData {
        if (!WorldData._instance) WorldData._instance = new WorldData();

        return WorldData._instance;
    }

    public registerWorld(world: World) {
        this.world = world;
    }

    public get numberOfNodes() {
        if (this.world) return this.world.numberOfNodes;

        return 0;
    }

    public get numberOfEdges() {
        if (this.world) return this.world.numberOfEdges;

        return 0;
    }
}
