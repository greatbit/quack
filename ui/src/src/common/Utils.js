import Moment from 'moment/min/moment.min.js';
import * as UserSession  from '../user/UserSession';
import $ from 'jquery';
import qs from 'qs';


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
                text: testCase.name || testCase.importedName || "",
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
    var plug = "";
    console.log(testCase.id + " " + testCase.automated)
    if (testCase.automated){
        plug = "<FontAwesomeIcon icon={faPlug}/>";
    }
    return plug + '<img src="' + getStatusImg(testCase) + '" height="18" width="18"/>';
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

export function onErrorMessage(message, error){
    if (error && error.response && error.response.message){
        message = message + error.response.data.message;
    }
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

export function queryToFilter(locationSearch){
    var params = qs.parse(locationSearch);
    var filter = {};
    filter.skip = params.skip || 0;
    filter.limit = params.limit || 20;
    if (params.from_createdTime){
        filter.from_createdTime = params.from_createdTime;
    }
    if (params.to_createdTime){
        filter.to_createdTime = params.to_createdTime;
    }
    if (params.like_name){
        filter.like_name = params.like_name;
    }
    Object.keys(params).forEach((key) => {
        filter[key] = params[key];
    });
    return filter;
}

export function filterToQuery(filter){
    var tokens = [];
    Object.keys(filter).forEach((key) => {
        if (Array.isArray(filter[key])){
            filter[key].forEach((value) => tokens.push(key + "=" + value))
        } else {
            tokens.push(key + "=" + filter[key]);
        }
    });
    return tokens.join("&");
}

export function timePassed(passedTime){
   var passedTimeDisplayValue = "0";

   if (passedTime == null || passedTime == undefined || passedTime == 'undefined' || passedTime == "" || passedTime == 0){
       return passedTimeDisplayValue;
   }

   if (passedTime > 0 && passedTime < 1000 ){
       return "Less than 1 second";
   }

   if (passedTime >= 1000 && passedTime < 60000 ){
       return Math.floor(passedTime / 1000) + " sec"
   }

   if (passedTime >= 60000 && passedTime < 3600000 ){
       return Math.floor(passedTime / 60000) + " min"
   }

   if (passedTime >= 3600000 ){
       passedTimeDisplayValue = Math.floor(passedTime / 3600000) + " hour "
       passedTimeDisplayValue = passedTimeDisplayValue +
           Math.floor(((passedTime/3600000 - Math.floor(passedTime / 3600000)) * 60)) +  " min"
   }
   return passedTimeDisplayValue;
}

export function getLaunchDescriptor(descriptors, launcherId){
    return (descriptors || []).find(descriptor => descriptor.launcherId == launcherId);
}