import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import TestCaseForm from '../testcases/TestCaseForm'
import TestCasesFilter from '../testcases/TestCasesFilter'
import TestCase from '../testcases/TestCase'
import axios from "axios";
import $ from 'jquery';
import queryString from 'query-string';

var jQuery = require('jquery');
window.jQuery = jQuery;
window.jQuery = $;
window.$ = $;
global.jQuery = $;

require('gijgo/js/gijgo.min.js');
require('gijgo/css/gijgo.min.css');

class TestCases extends SubComponent {

    state = {
        testcases: [],
        testcasesTree: {children: []},
        testcaseToEdit: {
            id: null,
            name: ""
        },
        projectAttributes: [],
        selectedTestCase: {},
        filter: {}
    };

    constructor(props) {
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.parseTree = this.parseTree.bind(this);
        this.getTestCaseFromTree = this.getTestCaseFromTree.bind(this);
        this.refreshTree = this.refreshTree.bind(this);
        this.getQueryParams = this.getQueryParams.bind(this);
        this.getFilterQParams = this.getFilterQParams.bind(this);
        this.getGroupingQParams = this.getGroupingQParams.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        var params = queryString.parse(this.props.location.search);
        if (params.testcase){
            this.state.selectedTestCase = {id: params.testcase};
        }

        /////////////////TEMP
        axios
          .get("/api/" + this.props.match.params.project + "/testcase")
          .then(response => {

            const testcases = response.data.map(testcase => {
              return {
                id: testcase.id,
                name: testcase.name,
                attributes: testcase.attributes
              };
            });

            const newState = Object.assign({}, this.state, {
              testcases: testcases
            });

            this.setState(newState);
          })
          .catch(error => console.log(error));

          axios
            .get("/api/" + this.props.match.params.project + "/attribute")
            .then(response => {
                 this.state.projectAttributes = response.data;
                 this.setState(this.state);
                 this.refreshTree();
            })
            .catch(error => console.log(error));
     }

     editTestcase(testcaseId){
        this.state.testcaseToEdit = this.state.testcases.find(function(testcase){
            return testcaseId === testcase.id
        }) || {};
        this.setState(this.state);
        $("#editTestcase").modal('toggle');
     }


     onTestCaseAdded(testcase){
     }

     onFilter(filter){
        this.state.filter = filter;
        axios
          .get("/api/" + this.props.match.params.project + "/testcase/tree?" + this.getFilterApiRequestParams(filter))
          .then(response => {
            this.state.testcasesTree = response.data;
            this.setState(this.state);
            this.refreshTree();
          })
          .catch(error => console.log(error));
          this.props.history.push("/" + this.props.match.params.project + '/testcases?' + this.getQueryParams(filter));
     }

     getFilterApiRequestParams(filter){
         var tokens = (filter.groups || []).map(function(group){return "groups=" + group});
         filter.filters.forEach(function(filter){
             filter.values.forEach(function(value){
                 tokens.push("attribute=" + filter.id + ":" + value);
             })
         })
         return tokens.join("&");
     }

     refreshTree(){
        if (this.tree){
            this.tree.destroy()
        }
        this.tree = $("#tree").tree({
            primaryKey: 'id',
            uiLibrary: 'bootstrap4',
            dataSource: this.parseTree()
        });
        this.tree.on('select', function (e, node, id) {
            this.state.selectedTestCase = this.getTestCaseFromTree(id);
            this.props.history.push("/" + this.props.match.params.project + '/testcases?' + this.getQueryParams(this.state.filter));
            this.setState(this.state);
        }.bind(this));
     }

     parseTree(){
        return this.getTreeNode(this.state.testcasesTree).children || [];
     }

     getTestCaseFromTree(id, head){
        if(!head){
            head = this.state.testcasesTree;
        }

        if (head.testCases && head.testCases.length > 0){
            var foundTestCase = (head.testCases || []).find(function(testCase){
                return testCase.id === id;
            })
            if (foundTestCase){
                return foundTestCase;
            }
        } else {
            return (head.children || []).
                    map(function(child){return this.getTestCaseFromTree(id, child)}.bind(this)).
                    find(function(child){return child !== undefined})
        }
        return undefined;
     }

     getTreeNode(node){
        var resultNode = {text: node.title, isLeaf: false};
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
            resultNode.children = node.children.map(function(child){return this.getTreeNode(child)}.bind(this));
        }
        return resultNode;
     }

     getQueryParams(filter){
        var testcaseIdAttr = "";
        if (this.state.selectedTestCase.id){
            testcaseIdAttr = "testcase=" + this.state.selectedTestCase.id;
        }
         return [this.getFilterQParams(filter), this.getGroupingQParams(filter), testcaseIdAttr].
                        filter(function(val){return val !== ""}).join("&");
     }

    getFilterQParams(filter){
        var activeFilters = filter.filters.filter(function(filter){return filter.id}) || [];
        var attributesPairs = [];
        activeFilters.forEach(function(filter){
            var tokens = filter.values.map(function(value){
                return "attribute=" + filter.id + ":" + value
            })
            attributesPairs = attributesPairs.concat(tokens);
        })

        return attributesPairs.join("&") || "";
    }

    getGroupingQParams(filter){
        return filter.groups.map(function(group){return "groups=" + group}).join("&") || "";
    }

    render() {
        var that = this;

        return (
            <div>
              <div>
                <TestCasesFilter projectAttributes={this.state.projectAttributes}
                        onFilter={this.onFilter} project={this.props.match.params.project}/>
              </div>

              <div className="row">
                <div className="tree-side col-6">
                    <div id="tree"></div>
                </div>
                <div id="testCase" className="testcase-side col-6">
                    <TestCase projectId={this.props.match.params.project} testcaseId={this.state.selectedTestCase.id}/>
                </div>
              </div>

              <div>
                  <div>
                    <ul>{
                        this.state.testcases.map(function(testcase, i){
                            return <li key={i}>
                                <Link to={"/" + that.props.match.params.project + "/testcases/" + testcase.id}>{testcase.name}</Link>
                                <span onClick={(e) => that.editTestcase(testcase.id)}>Edit</span>
                            </li>
                        })
                    }</ul>
                  </div>
                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editTestcase">
                    Add
                  </button>
                  <div className="modal fade" id="editTestcase" tabIndex="-1" role="dialog" aria-labelledby="editTestcaseLabel" aria-hidden="true">
                      <TestCaseForm project={this.props.match.params.project}
                              testcase={this.state.testcaseToEdit}
                              projectAttributes={this.state.projectAttributes}
                              onTestCaseAdded={this.onTestCaseAdded}/>
                  </div>
              </div>

            </div>
        );
      }

}

export default TestCases;
