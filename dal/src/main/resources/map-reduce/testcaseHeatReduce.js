function reduce(key, values) {
    "use strict";

    var reduceResult = values.reduce(function (result, testcase) {
        Object.keys(result.statuses).forEach((key) => {result.statuses[key] = result.statuses[key] + testcase.statuses[key]});
        return result;
    });

    return reduceResult;
}
