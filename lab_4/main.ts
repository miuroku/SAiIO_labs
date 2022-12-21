let graph = require("./test_data_4.json");

const findRoad = (s, t) => {
  const visited = [s];
  const flow = [];

  let i = 0;
  while (true) {
    const current = step2(s, visited);
    // console.log(current)
    if (Object.keys(current).length === 0) {
      return [[], []]
    }
    // console.log(current);
    // console.log(current)
    const currentKey = Object.keys(current)[0];
    flow.push(current[currentKey]);
    visited.push(currentKey);

    // console.log(current);

    if (currentKey !== t) {
      s = currentKey;
    } else {
      // console.log(visited, flow);
      break;
    }
    i++;
  }

  return [visited, flow];
};

function step2(key, visited) {
  let mode = true;
  let temp = graph[key].out;
  
  console.log(temp, key)

  let keys = Object.keys(temp).filter(
    (key) => !visited.includes(key) && temp[key].was !== 0
  );

  if (keys.length === 0) {
    temp = graph[key].in;

    if (temp === null) {
      return {};
    }

    keys = Object.keys(temp).filter(
      (key) => !visited.includes(key) && temp[key].be - temp[key].was > 0
    );
    mode = false
  }

  const current = keys.reduce(
    (acc, val) =>
      acc.val < ( mode ? temp[val].was : temp[val].be - temp[val].was)
        ? { val: temp[val].was, point: { [val]: mode ? temp[val].was : temp[val].be - temp[val].was } }
        : acc,
    { val: -1, point: {} }
  );

  return current.point;
};

function updateGraph(visited, value) {
  while (visited.length !== 1) {
    // Get current and prev data
    const current = visited.pop();
    const prev = visited[visited.length - 1];

    // Check prev in graph
    if (prev in graph[current].in) {
      graph[current].in[prev].was -= value;
      graph[prev].out[current].was -= value;
    } else {
      graph[prev].in[current].was += value;
      graph[current].out[prev].was += value;
    }
  }
};

function process(graph, s, t) {
  let i = 0;
  let maxFlow = 0;

  function whileAction() {
    // Find road.
    const [visited, flow] = findRoad(s, t);
    
    // Out max flow.
    if (visited.length === 0) {
      console.log('max flow: ', maxFlow)
      return;
    }
    const min = Math.min(...flow);
    maxFlow += min;
    console.log(visited, maxFlow)

    updateGraph(visited, min)
    i++;
  }

  while (true) {
    whileAction(); 
  }
};

process(graph, "1", "4");
