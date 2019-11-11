function map() {

    function traverseTree(head){
        (head.testCases || []).forEach(testCase => {
            var statusCounters = {
               PASSED: 0,
               FAILED: 0,
               BROKEN: 0,
               SKIPPED: 0,
               RUNNABLE: 0,
               RUNNING: 0
            }
            statusCounters[testCase.launchStatus]++;
            emit(testCase._id, {
                name: testCase.name || testCase.importedName || "",
                total: 1,
                id: testCase._id,
                statusCounters: statusCounters
            });
        })
        head.children.forEach(child => traverseTree(child));
    }

    traverseTree(this.testCaseTree);
}


