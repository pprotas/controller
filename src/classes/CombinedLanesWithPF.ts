import LaneWithPF from "./LaneWithPF";

export default class CombinedLanesWithPF extends LaneWithPF {
  readonly isLaneWithPF: boolean = true;

  public componentLanesWithPF: LaneWithPF[];

  get value(): number {
    this.componentLanesWithPF.forEach(lane => {
      this.value += lane.value;
    });
    return this.value;
  }
  
  set value(value: number) {
    this.value = value;
  }

  constructor(public id: string, ...laneWithPF: LaneWithPF[]) {
    super(id, 0);
    this.componentLanesWithPF = laneWithPF;
  }
}