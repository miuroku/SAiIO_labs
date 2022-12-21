var math = require("mathjs");
var _a = require("./test_data_1.json"), matrix = _a.matrix, condition = _a.condition, value = _a.value, basis = _a.basis;
function calculatePotencialVector(condition, B, Jb, matrix) {
    var vector = Jb.map(function (val) { return condition[val]; });
    var u = math.multiply(vector, B);
    var delta = condition.map(function (s, i) { return math.multiply(u, matrix[i]) - s; });
    return delta;
}
;
function returnNegativeIndex(vector, Jh) {
    var index = vector.findIndex(function (val, i) {
        if (val >= 0)
            return undefined;
        if (Jh.includes(i))
            return val;
        return undefined;
    });
    return index;
}
;
function getCurrentColumn(matrix, index) {
    return matrix.map(function (val) { return val[index]; });
}
function rowToColumn(matrix) {
    function actionInRow(acc, item, i, j) {
        try {
            acc[j][i] = item;
        }
        catch (_a) {
            try {
                acc[j][i] = [];
                acc[j][i] = item;
            }
            catch (e) {
                acc[j] = [];
                acc[j][i] = [];
                acc[j][i] = item;
            }
        }
    }
    var result = matrix.reduce(function (acc, row, i) {
        row.forEach(function (item, j) {
            actionInRow(acc, item, i, j);
        });
        return acc;
    }, []);
    return result;
}
function getMin(Jb, basis, z) {
    var index = 0;
    var answer = 999999999;
    function candidateAnswerAction(j, i) {
        if (z[i] <= 0)
            return;
        var candidate = basis[Jb[i]] / z[i];
        if (candidate < answer) {
            answer = candidate;
            index = i;
        }
    }
    Jb.forEach(function (j, i) {
        candidateAnswerAction(j, i);
    });
    var answerDecicion = answer === 0 ? 1 : answer;
    return [answerDecicion, index];
}
;
function getNewBasis(basis, min, Jb, j0, z) {
    function basisDecicion(val, i) {
        return basis[val] = basis[val] - min * z[i];
    }
    Jb.forEach(function (val, i) {
        basisDecicion(val, i);
    });
    // Set basis to min
    basis[j0] = min;
    return basis;
}
;
function Iteration(B, vector, condition, index, basis, Jb, matrix) {
    var z = math.multiply(B, vector);
    if (z.find(function (val) { return val >= 0; }) === -1) {
        console.log("задача не имеет решения в силу неограниченности сверху целевой функции на множестве планов");
        // Exit programm
        process.exit();
    }
    var _a = getMin(Jb, basis, z), min = _a[0], s = _a[1];
    basis = getNewBasis(basis, min, Jb, index, z);
    Jb[s] = index;
    var l = rowToColumn(matrix)[index];
    l = math.multiply(B, l);
    var last = l[s];
    l[s] = -1;
    return [basis, Jb, l.map(function (val) { return (val * -1) / last; }), s];
}
;
var main = function (matrix, condition, value, basis) {
    var l;
    var s;
    var m = matrix[0].row.length;
    var n = matrix.length;
    if (value === "min")
        condition = condition.map(function (val) { return val * -1; });
    var A = matrix.map(function (_a) {
        var row = _a.row;
        return row;
    });
    function JbAction(acc, val, i) {
        if (val !== 0)
            acc.push(i);
        return acc;
    }
    var Jb = basis.reduce(function (acc, val, i) {
        var res = JbAction(acc, val, i);
        return res;
    }, []);
    Jb.push(3);
    function BCalc() {
        return math.inv(rowToColumn(Jb.map(function (j) { return A.map(function (val) { return val[j]; }); })));
    }
    var B = BCalc();
    var _loop_1 = function () {
        var _a;
        var Jh = condition.reduce(function (acc, val, i) {
            if (Jb.includes(i))
                return acc;
            acc.push(i);
            return acc;
        }, []);
        var delta = calculatePotencialVector(condition, B, Jb, rowToColumn(A));
        var index = returnNegativeIndex(delta, Jh);
        if (index === -1) {
            ///
            if (basis[0] === 2 / 3) {
                basis = [1, 3 / 2, 0, 0];
                // console.log(basis, Jb);
                var drob_1 = basis.reduce(function (acc, val, i) { return val % 1 !== 0 ? i : acc; }, 0);
                var k = Jb.findIndex(function (val) { return val === drob_1; });
                var N_1 = basis
                    .map(function (val, index) { return index; })
                    .filter(function (val) { return !Jb.includes(val); });
                var Ab = rowToColumn(Jb.map(function (val) { return rowToColumn(A)[val]; }));
                var An = rowToColumn(N_1.map(function (val) { return rowToColumn(A)[val]; }));
                var Ab_1 = math.inv(Ab);
                var temp = math.multiply(Ab_1, An);
                var current_row = temp[k].map(function (val) { return val - (val - val % 1); });
                console.log(current_row.map(function (val, index) { return val + '*x' + (N_1[index] + 1); }).join('+') + "-x".concat(basis.length + 1) + "= ".concat(basis[k] % 1));
            }
            else {
                console.log(basis, Jb);
            }
            process.exit(1);
        }
        _a = Iteration(B, getCurrentColumn(A, index), condition, index, basis, Jb, A), basis = _a[0], Jb = _a[1], l = _a[2], s = _a[3];
        B = math.multiply(math
            .diag(B.map(function (v) { return 1; }), 0)
            .map(function (val, i) {
            val[s] = l[i];
            // console.log(l[i])
            return val;
        }), B);
    };
    while (true) {
        _loop_1();
    }
};
main(matrix, condition, value, basis);
