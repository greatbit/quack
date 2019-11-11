function reduce(key, values) {
    "use strict";
    function setTimeForNotFinishedLaunch(launch) {
        if(launch.launchTimes.lastFinish === 0) {
            launch.launchTimes.lastFinish = currDate;
        }
    }
    var currDate = Date.now();
    setTimeForNotFinishedLaunch(values[0]);

    var reduceResult = values.reduce(function (result, launch) {
        setTimeForNotFinishedLaunch(launch);

        result.continuousExec = result.continuousExec.concat(launch.continuousExec);

        if (result.launchTimes.firstStart === 0){
            result.launchTimes.firstStart = launch.launchTimes.firstStart;
        }
        result.launchTimes.firstStart = Math.min(result.launchTimes.firstStart, launch.launchTimes.firstStart);
        result.launchTimes.lastStart = Math.max(result.launchTimes.lastStart, launch.launchTimes.lastStart);
        result.launchTimes.lastFinish = Math.max(result.launchTimes.lastFinish, launch.launchTimes.lastFinish);

        result.launchTimes.duration += launch.launchTimes.duration;

        Object.keys(result.launchStats.statusCounters).forEach(function(key){
            result.launchStats.statusCounters[key] += launch.launchStats.statusCounters[key];
        })
        result.launchStats.total += launch.launchStats.total;

        Object.keys(launch.users).forEach(function(user) {
            if(!result.users[user]) {
                result.users[user] = 0;
            }
            result.users[user] += launch.users[user];
        });

        result.launchCount += launch.launchCount;
        result.casesCount += launch.casesCount;

        return result;
    });

    if(reduceResult.continuousExec.length === 0){
        return reduceResult;
    }

    reduceResult.continuousExec.sort(function(a, b){
        var keyA = a.start,
            keyB = b.start;
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
    });

    reduceResult.launchTimes.idle = 0;
    var lastFinish = reduceResult.continuousExec[0].finish;
    if (lastFinish === 0){
        lastFinish = currDate;
    }
    reduceResult.continuousExec.forEach(function(exec){
        if (exec.start > lastFinish) {
            reduceResult.launchTimes.idle += (exec.start - lastFinish);
        }
        lastFinish = Math.max(exec.finish, lastFinish);
    });

    return reduceResult;
}
