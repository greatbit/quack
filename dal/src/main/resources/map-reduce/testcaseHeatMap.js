function map() {

    function traverseTree(head){
        (head.testCases || []).forEach(testCase => {
            var statuses = {
               PASSED: 0,
               FAILED: 0,
               BROKEN: 0,
               SKIPPED: 0,
               TOTAL: 1,
               RUNNABLE: 0,
               RUNNING: 0
            }
            statuses[testCase.launchStatus]++;
            emit(testCase._id, {
                name: testCase.name,
                statuses: statuses
            });
        })
        head.children.forEach(child => traverseTree(child));
    }

    traverseTree(this.testCaseTree);
}


