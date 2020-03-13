import ILaneWithValue from "../interfaces/ILaneWithValue";

export default class LaneWithValue implements ILaneWithValue {
    constructor(public id: string, public value: number){
    }
}