function map() {

    function traverseTree(head, results){
        (head.testCases || []).forEach(testCase => {
            results.totalCases++;
            (testCase.users || []).forEach(user => {
                if(user) {
                    results.users[user] = (results.users[user] || 0) + 1;
                }
            })
        })
        head.children.forEach(child => traverseTree(child, results));
    }

    if (!this.users) {
        this.users = {};
    }
    var currDate = Date.now();
    var duration = 0;
    if (!this.finishTime || this.finishTime == 0){
        this.finishTime = currDate;
    }
    if (!this.startTime || this.startTime == 0){
        this.startTime = currDate;
    }
    duration = this.finishTime - this.startTime;
    this.totalCases = 0;
    traverseTree(this.testCaseTree, this);

    this.launchStats.statusCounters.TOTAL = this.launchStats.total;
    var objectTiEmit = {
        launchCount: 1,
        casesCount: this.totalCases,
        launchTimes: {
            duration : duration,
            firstStart: this.startTime,
            lastStart: this.startTime,
            lastFinish: this.finishTime,
            idle: 0
        },
        statuses: this.launchStats.statusCounters,
        continuousExec: [{start: this.startTime, finish: this.finishTime}],
        users: this.users,
        startTime: this.startTime
    };
    emit("all", objectTiEmit);

}


