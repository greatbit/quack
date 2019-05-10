import Moment from 'moment/min/moment.min.js';
import * as UserSession  from '../user/UserSession';
import $ from 'jquery';


export function intDiv(val, by){
    return (val - val % by) / by;
}

export function parseTree(testcasesTree){
    return getTreeNode(testcasesTree, []).children || [];
}

export function getTreeNode(node, parentsToUpdate){
    var resultNode = {text: node.title, isLeaf: false, id: node.id, uuid: node.uuid};
    resultNode.TOTAL = 0;
    resultNode.PASSED = 0;
    resultNode.FAILED = 0;
    resultNode.BROKEN = 0;
    resultNode.SKIPPED = 0;
    resultNode.RUNNING = 0;
    resultNode.RUNNABLE = 0;
    parentsToUpdate.push(resultNode);
    if (node.testCases && node.testCases.length > 0){
        resultNode.children = [];
        node.testCases.forEach(function(testCase){
            resultNode.children.push({
                text: testCase.name,
                id: testCase.id,
                uuid: testCase.uuid,
                isLeaf: true,
                statusHtml: getStatusHtml(testCase)
            });
            parentsToUpdate.forEach(function(parent){
                if (!parent[testCase.launchStatus]){
                    parent[testCase.launchStatus] = 0;
                }
                parent[testCase.launchStatus] = parent[testCase.launchStatus] + 1;
                parent.TOTAL = (parent.TOTAL || 0) + 1;
                parent.statusHtml = getNodeStatusHtml(parent);
            })
        })
    }
    if (node.children && node.children.length > 0){
        resultNode.children = node.children.map(function(child){return getTreeNode(child, parentsToUpdate.slice(0))});
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

export function getNodeFromDataSource(id, head){
    if(!head){
        head = this.state.testcasesTree;
    }
    if (head.uuid == id){
        return head;
    } else {
        return (head.children || []).
                map(function(child){return getNodeFromDataSource(id, child)}.bind(this)).
                find(function(child){return child !== undefined})
    }
    return undefined;
}


export function getNodeStatusImg(node){
    if ((node.FAILED || 0) > 0){
        return '/images/fail.png';
    }
    if ((node.BROKEN || 0) > 0){
        return '/images/broken.png';
    }
    if ((node.RUNNING || 0) > 0){
        return '/images/running.png';
    }
    if ((node.PASSED || 0) > 0 && node.PASSED == node.TOTAL){
        return '/images/passed.png';
    }
    if ((node.SKIPPED || 0) == node.TOTAL){
        return '/images/skipped.png';
    }
    return '/images/1px.png';
}

export function getNodeStatusHtml(node){
    return '<img src="' + getNodeStatusImg(node) + '" height="18" width="18"/>';
}


export function getStatusImg(testCase){
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

export function getStatusHtml(testCase){
    return '<img src="' + getStatusImg(testCase) + '" height="18" width="18"/>';
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
    return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() +
        " " + date.getHours() + ":" + currMinutes;
}

export function longToDateTimeFormatted(uts, format) {
    return Moment(uts).format(format);
}


export function getDatepickerTime(timeMillis){
    if (timeMillis && timeMillis != null){
        return new Date(Number(timeMillis));
    }
    return null;
}

export function isUserOwnerOrAdmin(createdById){
    return UserSession.getSession() && (UserSession.getSession().isAdmin || UserSession.getSession().login === createdById);
}

export function onErrorMessage(message){
     $("#error-message-text").html(message);
     $("#error-alert").show();
     $("#error-alert").fadeTo(5000, 500).slideUp(500, function(){
         $("#error-alert").slideUp(500);
         $("#error-message-text").html("");
      });
}

export function onSuccessMessage(message){
    $("#success-message-text").html(message);
    $("#success-alert").fadeTo(5000, 500).slideUp(500, function(){
        $("#success-alert").slideUp(500);
        $("#success-message-text").html("");
     });
}

export function getProgressBarStyle(value, total){
    return {width:  (value * 100) / total + '%'};
}

export function getProgressBarNumber(value, total){
    if (!value || value == 0 || (value * 100) / total < 2) {
        return  "";
    }
    return value;
}