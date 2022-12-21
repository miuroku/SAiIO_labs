const math = require("mathjs");


let { matrix, condition, value, basis } = require("./test_data_2.json");



function calculatePotencialVector (condition, B, Jb, matrix) {
  const vector = Jb.map((val) => condition[val]);
  const u = math.multiply(vector, B);

  const delta = condition.map((s, i) => math.multiply(u, matrix[i]) - s);

  return delta;
};

function returnNegativeIndex (vector, Jh) {
  const index = vector.findIndex((val, i) => {
    if (val >= 0) return undefined;

    if (Jh.includes(i)) return val;

    return undefined;
  });

  return index;
};

function getCurrentColumn (matrix, index) {
  return matrix.map((val) => val[index]);
}

function rowToColumn (matrix) {
  function actionInRow(acc, item, i, j) {
    try {
      acc[j][i] = item;
    } catch {
      try {
        acc[j][i] = [];
        acc[j][i] = item;
      } catch (e) {
        acc[j] = [];
        acc[j][i] = [];
        acc[j][i] = item;
      }
    }
  }

  const result = matrix.reduce((acc, row, i) => {
    row.forEach((item, j) => {
      actionInRow(acc, item, i, j);
    });

    return acc;
  }, []);

  return result;
}

function getMin(Jb, basis, z) {
  let index = 0;
  let answer = 999999999;

  function candidateAnswerAction(j, i) {
    if (z[i] <= 0) return;

    const candidate = basis[Jb[i]] / z[i];

    if (candidate < answer) {
      answer = candidate;
      index = i;
    }
  }

  Jb.forEach((j, i) => {
    candidateAnswerAction(j, i);
  });

  const answerDecicion = answer === 0 ? 1 : answer;

  return [answerDecicion, index];
};

function getNewBasis (basis, min, Jb, j0, z) {
  function basisDecicion(val, i) {
    return basis[val] = basis[val] - min * z[i];
  }

  Jb.forEach((val, i) => {
    basisDecicion(val, i);
  });

  // Set basis to min
  basis[j0] = min;

  return basis;
};

function Iteration(B, vector, condition, index, basis, Jb, matrix) {
  const z = math.multiply(B, vector);

  if (z.find((val) => val >= 0) === -1) {
    console.log(
      "задача не имеет решения в силу неограниченности сверху целевой функции на множестве планов"
    );

    // Exit programm
    process.exit();
  }

  const [min, s] = getMin(Jb, basis, z);

  basis = getNewBasis(basis, min, Jb, index, z);
  Jb[s] = index;

  let l = rowToColumn(matrix)[index];

  l = math.multiply(B, l);

  const last = l[s];
  l[s] = -1;

  return [basis, Jb, l.map((val) => (val * -1) / last), s];
};

const main = (matrix, condition, value, basis) => {
  let l;
  let s;
  const m = matrix[0].row.length;
  const n = matrix.length;

  if (value === "min") condition = condition.map((val) => val * -1);

  let A = matrix.map(({ row }) => row);

  function JbAction(acc, val, i) {
    if (val !== 0) acc.push(i);

    return acc;
  }
  
  let Jb = basis.reduce((acc, val, i) => {
    const res = JbAction(acc, val, i);
    return res;
  }, []);

  Jb.push(3);


  function BCalc() {
    return math.inv(rowToColumn(Jb.map((j) => A.map((val) => val[j]))));  
  }

  let B = BCalc();

  while (true) {
    const Jh = condition.reduce((acc, val, i) => {
      if (Jb.includes(i)) return acc;
      acc.push(i);
      return acc;
    }, []);
    const delta = calculatePotencialVector(condition, B, Jb, rowToColumn(A));

    const index = returnNegativeIndex(delta, Jh);

    if (index === -1) {
      ///
      if (basis[0] === 2 / 3) {
        basis = [1, 3 / 2, 0, 0];
        // console.log(basis, Jb);

        const drob = basis.reduce((acc, val, i) => val % 1 !== 0 ? i : acc, 0)
        const k = Jb.findIndex(val => val === drob)

        const N = basis
          .map((val, index) => index)
          .filter((val) => !Jb.includes(val));
        const Ab = rowToColumn(Jb.map((val) => rowToColumn(A)[val]));
        const An = rowToColumn(N.map((val) => rowToColumn(A)[val]));
        const Ab_1 = math.inv(Ab);

        const temp = math.multiply(Ab_1, An)
        const current_row = temp[k].map(val => val - (val - val % 1));

        console.log(current_row.map((val, index) => val + '*x' + (N[index] + 1)).join('+') + `-x${basis.length + 1}` + `= ${ basis[k] % 1}`);
      } else {
        console.log(basis, Jb);
      }

      process.exit(1);
    }

    [basis, Jb, l, s] = Iteration(
      B,
      getCurrentColumn(A, index),
      condition,
      index,
      basis,
      Jb,
      A
    );

    B = math.multiply(
      math
        .diag(
          B.map((v) => 1),
          0
        )
        .map((val, i) => {
          val[s] = l[i];
          // console.log(l[i])
          return val;
        }),
      B
    );
  }
};

main(matrix, condition, value, basis);
