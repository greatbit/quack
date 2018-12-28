export function intDiv(val, by){
    return (val - val % by) / by;
}

export function parseTree(testcasesTree){
    return getTreeNode(testcasesTree).children || [];
}

export function getTreeNode(node){
    var resultNode = {text: node.title, isLeaf: false, id: node.id};
    if (node.testCases && node.testCases.length > 0){
        resultNode.children = node.testCases.map(function(testCase){
            return {
                text: testCase.name,
                id: testCase.id,
                isLeaf: true
            }
        })
    }
    if (node.children && node.children.length > 0){
        resultNode.children = node.children.map(function(child){return getTreeNode(child)});
    }
    return resultNode;
}