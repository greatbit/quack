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

    if (!this.users || this.users.length == 0) {
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

    var objectTiEmit = {
        launchCount: 1,
        casesCount: this.totalCases,
        launchTimes: {
            duration : duration,
            firstStart: NumberLong(this.startTime).valueOf(),
            lastStart: NumberLong(this.startTime).valueOf(),
            lastFinish: NumberLong(this.finishTime).valueOf(),
            idle: 0
        },
        launchStats: this.launchStats,
        continuousExec: [{start: this.startTime, finish: this.finishTime}],
        users: this.users,
        startTime: this.startTime
    };

    emit("all", objectTiEmit);
}


