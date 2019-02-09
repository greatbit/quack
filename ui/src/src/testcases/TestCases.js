import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import TestCaseForm from '../testcases/TestCaseForm'
import TestCasesFilter from '../testcases/TestCasesFilter'
import TestCase from '../testcases/TestCase'
import axios from "axios";
import $ from 'jquery';
import queryString from 'query-string';
import * as Utils from '../common/Utils';

var jQuery = require('jquery');
window.jQuery = jQuery;
window.jQuery = $;
window.$ = $;
global.jQuery = $;

require('gijgo/js/gijgo.min.js');
require('gijgo/css/gijgo.min.css');

class TestCases extends SubComponent {

    state = {
        testcasesTree: {children: []},
        testcaseToEdit: {
            id: null,
            name: "",
            attributes: {}
        },
        projectAttributes: [],
        selectedTestCase: {},
        filter: {}
    };

    constructor(props) {
        super(props);
        this.onFilter = this.onFilter.bind(this);
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
            this.setState(this.state);
        }
        if (params.testSuite){
            this.state.testSuite = {
                id: params.testSuite
            }
            this.setState(this.state);
        }
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
        var params = queryString.parse(this.props.location.search);
        if (params.testcase){
            this.state.selectedTestCase = {id: params.testcase};
        }
        axios
          .get("/api/" + this.props.match.params.project + "/testcase/tree?" + this.getFilterApiRequestParams(filter))
          .then(response => {
            this.state.testcasesTree = response.data;
            this.setState(this.state);
            this.refreshTree();
          })
          .catch(error => console.log(error));
          if (!params.testSuite){
            this.props.history.push("/" + this.props.match.params.project + '/testcases?' + this.getQueryParams(filter));
          }
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
            dataSource: Utils.parseTree(this.state.testcasesTree)
        });
        this.tree.on('select', function (e, node, id) {
            this.state.selectedTestCase = Utils.getTestCaseFromTree(id, this.state.testcasesTree, function(testCase, id){return testCase.id === id});
            this.props.history.push("/" + this.props.match.params.project + '/testcases?' + this.getQueryParams(this.state.filter));
            this.setState(this.state);
        }.bind(this));
        if (this.state.selectedTestCase.id){
            var node = this.tree.getNodeById(this.state.selectedTestCase.id);
            this.tree.select(node);
            this.state.filter.groups.forEach(function(groupId){
                var attributes = Utils.getTestCaseFromTree(this.state.selectedTestCase.id, this.state.testcasesTree, function(testCase, id){return testCase.id === id}).attributes || [];
                var attribute = attributes.find(function(attribute){return attribute.id === groupId}) || {} ;
                var values = attribute.values || ["None"];
                values.forEach(function(value){
                    var node = this.tree.getNodeById(groupId + ":" + value);
                    this.tree.expand(node);
                }.bind(this))

            }.bind(this))
        }

     }

     getQueryParams(filter){
        var testcaseIdAttr = "";
        if (this.state.selectedTestCase && this.state.selectedTestCase.id){
            testcaseIdAttr = "testcase=" + this.state.selectedTestCase.id;
        }
        var urlParts = [this.getFilterQParams(filter), this.getGroupingQParams(filter), testcaseIdAttr];
        if (this.state.testSuite){
            urlParts.push("testSuite=" + this.state.testSuite.id);
        }
        return urlParts.filter(function(val){return val !== ""}).join("&");
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
                <div className="tree-side col-5">
                    <div id="tree"></div>
                </div>
                <div id="testCase" className="testcase-side col-7">
                    {this.state.selectedTestCase.id &&
                        <TestCase projectId={this.props.match.params.project} projectAttributes={this.state.projectAttributes}
                                testcaseId={this.state.selectedTestCase.id}/>
                    }
                </div>
              </div>

              <div>
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
