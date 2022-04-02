import EntityType from "../EntityType";

export default interface IEntity {
	readonly id: number;
	zIndex: number;
	readonly type: EntityType;
	copy(): IEntity;
};