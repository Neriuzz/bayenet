export default class IDGenerator {
    static id = 0;

    public static next() {
        return this.id++;
    }
}
