const { L, references } = require("./test_data_5.json");

// vars
let vis = [];
const px = [];
const py = [];

function fill (arr, value, references) {
  for (let i = 0; i <= references.length; i++) {
    arr.push(value);
  }
};

const process = ({ L, references }) => {
  fill(px, -1, references);
  fill(py, -1, references);
  let isPath = true;

  // action for
  function inWhileCheckMinusOneAction() {
    for (let x of L) {
      if (px[x] == -1) {
        if (dfs(x, references)) isPath = true;
      }
    }
  }

  while (isPath) {
    isPath = false;
    vis = [];
    // Fill data
    fill(vis, false, references);
    // Chec minus one.
    inWhileCheckMinusOneAction();
  }

  const count = px.reduce((acc, val) => {
    if (val !== -1) {
      acc.push([py[val], val]);
    }
    return acc;
  }, []);

  return count;
};

const dfs = (x, references) => {
  if (vis[x]) return false;
  vis[x] = true;
  for (let y of references[x]) {
    if (py[y] == -1) {
      py[y] = x;
      px[x] = y;
      return true;
    } else {
      if (dfs(py[y], references)) {
        print();
        py[y] = x;
        px[x] = y;
        return true;
      }
    }
  }
  // } catch (e) {
  //   console.log('x', x, count)
  //   throw e;
  // }
  return false;
};

function print() {
  let answ = undefined;
  for (x of px) {
    if (x !== -1) {
      answ = `${answ ? answ + ", " : ""}{ ${py[x] + 1}, ${x + 1} }`;
    }
  }
  console.log(answ);
};

module.exports = {
  process,
};

console.log(process());
