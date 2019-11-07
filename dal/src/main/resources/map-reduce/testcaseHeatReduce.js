function reduce(key, values) {
    "use strict";

    var reduceResult = values.reduce(function (result, testcase) {
        Object.keys(result.statusCounters).forEach((key) =>
            {result.statusCounters[key] = result.statusCounters[key] + testcase.statusCounters[key]});
        result.total = result.total + testcase.total;
        return result;
    });

    return reduceResult;
}
