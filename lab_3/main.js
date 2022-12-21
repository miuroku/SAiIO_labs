const graph = require("./test_data_2.json");
const getKeys = (obj) => Object.keys(obj);
const opt = (graph, stack) => {
  const OPT = [{ [stack[0]]: 0 }];
  const max = stack.length;
  for (let i = 1; i < max; i++) {
    const temp = stack[i];
    const ins = getKeys(graph[temp].in);
    let currentWay = 0;
    let currentLength = 0;
    for (let way of ins) {
      if (way > "1") {
        const a = Object.values(OPT[Number(way) - 1])[0] + graph[temp].in[way];
        if (a > currentLength) {
          currentLength = a;
          currentWay = way;
        }
        continue;
      }
      const b = graph[temp].in[way];
      if (b > currentLength) {
        currentLength = b;
        currentWay = way;
      }
    }
    OPT.push({ [currentWay]: currentLength })
  }
  return OPT;
};
const CLRS = (graph, s, t) => {
  const stack = [];
  const visited = [];
  s = String(s);
  t = String(t);
  stack.push(s);
  while (true) {
    const temp = stack.pop();
    visited.push(temp);
    if (temp === t) {
      return visited;
    }
    if (!graph[temp].out) {
      return "No results";
    }
    stack.push(...getKeys(graph[temp].out).sort((a, b) => (a < b ? 1 : -1)));
  }
};
const getWay = (OPT, s, t) => {
  const way = [String(t)];
  t--;
  let temp = OPT[OPT.length - 1];
  while (true) {
    const w = Object.keys(temp)[0];
    way.push(w);
    if (Number(w) === s) {
      return way.reverse();
    }
    temp = OPT[Number(w) - 1]
  }
}
const stack = CLRS(graph, 1, 6);
const OPT = opt(graph, stack);
const way = getWay(OPT, 1, 6);
console.log(way.join('->'), Object.values(OPT[OPT.length - 1])[0])

