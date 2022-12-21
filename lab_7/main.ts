const input = require("./test_data_7.json");
const { process: findMaxPairs } = require("../lab4");

const findPairs = (input, a, b) => {
  const result = [];
  a.forEach((val_a, index_a) => {
    b.forEach((val_b, index_b) => {
      if (input[index_a][index_b] === val_a + val_b) {
        result.push([index_a, index_b]);
      }
    });
  });

  return result;
};

const prepareForFindMaxPairs = (input, pairs) => {
  const references = [];
  const L = [];

  input.forEach((val, index) => {
    references.push([]);
    references.push([]);
    L.push(index * 2);
  });

  pairs.forEach((val, index) => {
    references[L[val[0]]].push(L[val[1]] + 1);
  });

  return {
    L,
    references,
  };
};

const findIJ = (input, preparedForCLRS, references) => {  
  const ss = Object.keys(preparedForCLRS).reduce((acc, key) => {
    if (!preparedForCLRS[key].in && Number(key) % 2 === 0) {
      acc.push(key);
    }

    return acc;
  }, []);

  const I = [];
  const J = [];

  input.forEach(() => {
    I.push(-1);
    J.push(1);
  });

  for (s of ss) {
    const visited = CLRS(
      preparedForCLRS,
      s,
      (references.length - 1).toString()
    );

    visited.forEach((val) => {
      if (Number(val) % 2 === 0) {
        I[val / 2] = 1;
      } else {
        J[(val - 1) / 2] = -1;
      }
    });
  }

  return [I, J];
};

function CLRS(graph, s, t) {
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
      return visited;
    }

    stack.push(...getKeys(graph[temp].out).sort((a, b) => (a < b ? 1 : -1)));
  }
};

const init = (input, a, b) => {
  input[0].forEach((val, index) => {
    let minB = undefined;
    input.forEach((val) => {
      if (minB === undefined || val[index] < minB) {
        minB = val[index];
      }
    });

    a.push(0);
    b.push(minB);
  });
};

const preparedDataForCLRS = (preparedData, count) => {
  const result = {};

  preparedData.references.forEach((val, index) => {
    result[index] = {
      in: null,
      out: null,
    };
  });

  count.forEach((val) => {
    result[val[0]].in = result[val[0]].in
      ? { ...result[val[0]].in, [val[1]]: 1 }
      : { [val[1]]: 1 };
    result[val[1]].out = result[val[1]].out
      ? { ...result[val[1]].out, [val[0]]: 1 }
      : { [val[0]]: 1 };
    preparedData.references[val[0]] = preparedData.references[val[0]].filter(
      (dat) => dat !== val[1]
    );
  });

  preparedData.L.forEach((val) => {
    if (preparedData.references[val].length === 0) return;

    for (let i of preparedData.references[val]) {
      result[i].in = result[i].in
        ? { ...result[i].in, [val]: 1 }
        : { [val]: 1 };
      result[val].out = result[val].out
        ? { ...result[val].out, [i]: 1 }
        : { [i]: 1 };
    }
  });

  return result;
};

const print = (arr) => {
  let answ = undefined;

  for ([x, y] of arr) {
      answ = `${answ ? answ + ", " : ""}{ ${x + 1}, ${y + 1} }`;
  }
  console.log(answ);
};

const main = (input) => {
  const a = [];
  const b = [];

  init(input, a, b);

  // console.log(a, b);

  let i = 0;

  while (i < 3) {
    const pairs = findPairs(input, a, b);
    const preparedData = prepareForFindMaxPairs(input, pairs);
    const count = findMaxPairs(preparedData);

    if (count.length === input.length) {
      print(count);
      break;
    }

    const preparedForCLRS = preparedDataForCLRS(preparedData, count);
    const [I, J] = findIJ(input, preparedForCLRS, preparedData.references);
    let teta = undefined;

    I.forEach((Ival, i_index) => {
      J.forEach((Jval, j_index) => {
        const temp = (input[i_index][j_index] - a[i_index] - b[j_index]) / 2;
        if (!teta || teta > temp) {
          teta = temp;
        }
      });
    });

    I.forEach((val, index) => {
      a[index] = a[index] + teta * val;
      b[index] = b[index] + teta * J[index];
    });

    i++;
  }
};

main(input);
