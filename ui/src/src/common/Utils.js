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
                isLeaf: true
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
