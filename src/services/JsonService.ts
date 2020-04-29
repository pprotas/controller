import * as jsonfile from 'jsonfile';
import ILaneWithValue from '../interfaces/ILaneWithValue';
import LightColors from '../enums/LightColors';
import State from '../classes/State';
import LaneWithColor from '../classes/LaneWithColor';
import LaneWithValue from '../classes/LaneWithValue';

export default class JSONService {
  private static phasesFile = `${process.cwd()}/public/json/phases.json`;
  private static initFile = `${process.cwd()}/public/json/init.json`;
  private static combinationsFile = `${process.cwd()}/public/json/combinations.json`;

  static getPhases() {
    return jsonfile.readFileSync(this.phasesFile);
  }

  static getPhaseForLane(lane: ILaneWithValue): [string, number[]] | undefined {
    var phases = this.getPhases();
    for (var property in phases) {
      if (property === lane.id) {
        return phases[property];
      }
    }
    return undefined;
  }

  static getInit(): State<LaneWithValue> {
    var jsonObject = jsonfile.readFileSync(this.initFile);
    return new State<LaneWithValue>(LaneWithValue, jsonObject);
  }

  static getCombinations() {
    return jsonfile.readFileSync(this.combinationsFile);
  }

  // Gets all POSSIBLE green lights for the chosen lane.
  static applyPhase(lane: ILaneWithValue): State<LaneWithColor> {
    var phase = this.getPhaseForLane(lane);
    var init = this.getInit();

    Object.values(init).forEach(lane => {
      if (phase)
        if (phase.includes(lane.id))
          lane.value = LightColors.Green;
    });

    return <State<LaneWithColor>>init;
  }
}