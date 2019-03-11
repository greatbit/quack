import Moment from 'moment/min/moment.min.js';


export function intDiv(val, by){
    return (val - val % by) / by;
}

export function parseTree(testcasesTree){
    return getTreeNode(testcasesTree).children || [];
}

export function getTreeNode(node){
    var resultNode = {text: node.title, isLeaf: false, id: node.id, uuid: node.uuid};
    if (node.testCases && node.testCases.length > 0){
        resultNode.children = node.testCases.map(function(testCase){
            return {
                text: testCase.name,
                id: testCase.id,
                uuid: testCase.uuid,
                isLeaf: true,
                statusUrl: getStatusUrl(testCase)
            }
        })
    }
    if (node.children && node.children.length > 0){
        resultNode.children = node.children.map(function(child){return getTreeNode(child)});
    }
    return resultNode;
}

export function getTestCaseFromTree(id, head, matcher){
    if(!head){
        head = this.state.testcasesTree;
    }

    if (head.testCases && head.testCases.length > 0){
        var foundTestCase = (head.testCases || []).find(function(testCase){
            return matcher(testCase, id);
        })
        if (foundTestCase){
            return foundTestCase;
        }
    } else {
        return (head.children || []).
                map(function(child){return getTestCaseFromTree(id, child, matcher)}.bind(this)).
                find(function(child){return child !== undefined})
    }
    return undefined;
}

export function getStatusUrl(testCase){
    if (testCase && testCase.launchStatus){
        switch (testCase.launchStatus) {
          case 'FAILED':
            return '/images/fail.png';
            break;
          case 'BROKEN':
            return '/images/broken.png';
            break;
          case 'PASSED':
            return '/images/passed.png';
            break;
          case 'SKIPPED':
            return '/images/skipped.png';
            break;
          case 'RUNNING':
            return '/images/running.png';
            break;
        }
        return '/images/1px.png';
    }
    return undefined;
}

export function timeToDate(time) {
    if (!time || time == 0){
        return 'No data'
    }
    var date = new Date(parseInt(time));
    var currMinutes = date.getMinutes();
    var monthNames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    if (currMinutes < 10) {
        currMinutes = "0" + currMinutes;
    }
    return date.getDate() + " " + monthNames[date.getMonth()]
        + " " + date.getHours() + ":" + currMinutes;
}

export function longToDateTimeFormatted(uts, format) {
    return Moment(uts).format(format);
}