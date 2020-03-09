export var latestState;

export async function performLogic(state, ws) {
  const json = JSON.parse(state);
  var key = Object.keys(json).find(key => json[key] === Math.max.apply(Math, Object.values(json)));
}