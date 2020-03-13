import LaneWithValue from "./LaneWithValue";

export default class LaneWithPF extends LaneWithValue {
  readonly isLaneWithPF: boolean = true;

  constructor(public id: string, public value: number) {
    super(id, value);
  }
}