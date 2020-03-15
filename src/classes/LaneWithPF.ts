import LaneWithValue from "./LaneWithValue";

export default class LaneWithPF extends LaneWithValue {
  constructor(public id: string, public value: number) {
    super(id, value);
  }
}