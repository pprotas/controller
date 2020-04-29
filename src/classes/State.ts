import CombinedLane from "./CombinedLane";
import ILaneWithValue from "../interfaces/ILaneWithValue";
import LaneWithColor from "./LaneWithColor";
import LightColors from "../enums/LightColors";
import JSONService from "../services/JsonService";
import LaneWithValue from "./LaneWithValue";

export default class State<Lane extends ILaneWithValue> {
  [index: number]: Lane

  private _count: number = 0;
  get count(): number {
    return this._count;
  }

  constructor(type?: { new(id: string, value: number): Lane; }, object?: object, fillEmptyState: boolean = false) {
    if (object && type) {
      try {
        Object.entries(object)
          .sort((a, b) => b[1] - a[1])
          .forEach((parameter: any) => {
            this.addLane(new type(parameter[0], parameter[1]));
          });
      }
      catch (e) {
        throw new Error("Invalid object or type passed as parameter for State");
      }
    }
    if(fillEmptyState) {
      this.fillEmptyLanes();
    }
  }

  getLaneById(id: string): Lane | undefined {
    var x = this.getAllLanes()
    var y = x.find(lane => lane?.id === id );

    return y;
  }

  isEmptyState(): boolean {
    if (this.getAllLanes().map(lane => lane.value).some(value => value > 0)) {
      return false;
    }
    return true;
  }

  toStateWithColor(color: LightColors) {
    var state = new State<LaneWithColor>();
    this.getAllLanes().forEach(lane => {
      lane.value ? state.addLane(new LaneWithColor(lane.id, color)) : state.addLane(new LaneWithColor(lane.id, LightColors.Red));
    });
    return state;
  }

  getStateSortedByValue(): State<Lane> {
    var sortedLanes = this.getAllLanes()
      .sort((a, b) => b.value - a.value);
    var sortedState = new State();
    sortedLanes.forEach(lane => sortedState.addLane(lane));
    return <State<Lane>>sortedState;
  }

  getStateSortedAlphabetically(): State<Lane> {
    var sortedLanes = this.getAllLanes()
      .sort((a, b) => {
        var textA = a.id.toUpperCase();
        var textB = b.id.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    var sortedState = new State();
    sortedLanes.forEach(lane => sortedState.addLane(lane));
    return <State<Lane>>sortedState;
  }

  getSplitUpState(): State<Lane> {
    var partners: Lane[] = [];
    this.getAllLanes().forEach(lane => {
      if (lane instanceof CombinedLane) {
        (<Lane[]>lane.partners).forEach(lane => partners.push(lane));
      }
      else partners.push(lane);
    });
    var state = new State<Lane>();
    partners.forEach(lane => state.addLane(lane));
    return state;
  }

  addLane(lane: Lane, index?: number): void {
    if (!index)
      index = this.count;
    this[index] = lane;
    this._count++;
  }

  removeLane(index: number): void {
    delete this[index];
    this._count--;
  }

  getAllLaneIds(): string[] {
    return this.getAllLanes().map(lane => lane.id);
  }

  getAllLanes(): Lane[] {
    var lanes = Object.values(this);
    lanes.forEach((lane, index) => {
      if (lane.id == undefined) {
        delete lanes[index];
      }
    })

    return lanes;
  }

  getAllCombinations(): Lane[] {
    return this.getAllLanes().filter(lane => lane instanceof CombinedLane);
  }

  getAllLaneEntries(): [string, Lane][] {
    return Object.entries(this);
  }

  fillEmptyLanes() {
    var init = JSONService.getInit();
    init.getAllLaneIds().forEach(laneId => {
      if (!this.getAllLaneIds().includes(laneId)) {
        this.addLane(<Lane>new LaneWithValue(laneId, 0));
      }
    })
  }

  pop(): Lane {
    return this[this.count - 1];
  }

  toJson(): string {
    let json: string = "{\n";

    var x = Object.values(this);
    x.forEach(lane => {
      if (lane.id)
        json += `"${lane.id}": ${lane.value},`;
    });

    json = json.substring(0, json.length - 1);
    json += "\n}";

    return JSON.parse(json);
  }
}