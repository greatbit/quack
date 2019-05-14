import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import TestCaseForm from '../testcases/TestCaseForm'
import TestCasesFilter from '../testcases/TestCasesFilter'
import TestCase from '../testcases/TestCase'
import axios from "axios";
import $ from 'jquery';
import qs from 'qs';
import * as Utils from '../common/Utils';
import { FadeLoader } from 'react-spinners';

var jQuery = require('jquery');
window.jQuery = jQuery;
window.jQuery = $;
window.$ = $;
global.jQuery = $;

require('gijgo/js/gijgo.min.js');
require('gijgo/css/gijgo.min.css');

class TestCases extends SubComponent {

    defaultTestcase = {
        id: null,
        name: "",
        description: "",
        steps: [],
        attributes: {}
    };

    testCasesFetchLimit = 50;

    state = {
        testcasesTree: {children: []},
        testcaseToEdit: Object.assign({}, this.defaultTestcase),
        projectAttributes: [],
        selectedTestCase: {},
        filter: {},
        loading: true
    };

    constructor(props) {
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.refreshTree = this.refreshTree.bind(this);
        this.getQueryParams = this.getQueryParams.bind(this);
        this.getFilterQParams = this.getFilterQParams.bind(this);
        this.getGroupingQParams = this.getGroupingQParams.bind(this);
        this.onTestcaseSelected = this.onTestcaseSelected.bind(this);
        this.onTestCaseAdded = this.onTestCaseAdded.bind(this);
        this.loadMoreTestCases = this.loadMoreTestCases.bind(this);
        this.showLoadMore = this.showLoadMore.bind(this);
        this.updateCount = this.updateCount.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        var params = qs.parse(this.props.location.search);
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
          .catch(error => {Utils.onErrorMessage("Couldn't fetch attributes: " + error.response.data.message)});
     }

     editTestcase(testcaseId){
        this.state.testcaseToEdit = this.state.testcases.find(function(testcase){
            return testcaseId === testcase.id
        }) || {};
        this.setState(this.state);
        $("#editTestcase").modal('toggle');
     }


     onTestCaseAdded(testcase){
        this.onFilter(this.state.filter, function(){this.onTestcaseSelected(testcase.id); this.refreshTree();}.bind(this));
        $('#editTestcase').modal('hide');
        this.state.testcaseToEdit = Object.assign({}, this.defaultTestcase);
     }

     onFilter(filter, onResponse){
        var params = qs.parse(this.props.location.search);
        if (params.testcase){
            this.state.selectedTestCase = {id: params.testcase};
        }

        if (!filter.groups || filter.groups.length == 0){
            filter.skip = filter.skip || 0;
            filter.limit = this.testCasesFetchLimit;
        }

        this.state.filter = filter;
        this.state.loading = true;
        this.setState(this.state);
        axios
          .get("/api/" + this.props.match.params.project + "/testcase/tree?" + this.getFilterApiRequestParams(filter))
          .then(response => {
            this.state.testcasesTree = response.data;
            this.state.loading = false;
            this.setState(this.state);
            this.refreshTree();
            if (onResponse){
                onResponse();
            }
            this.updateCount();
          })
          .catch(error => {
                Utils.onErrorMessage("Couldn't fetch testcases tree: " + error.response.data.message);
                this.state.loading = false;
                this.setState(this.state);
           });
          if (!params.testSuite){
            this.props.history.push("/" + this.props.match.params.project + '/testcases?' + this.getQueryParams(filter));
          }
     }

     updateCount(){
        axios
            .get("/api/" + this.props.match.params.project + "/testcase/count?" + this.getFilterApiRequestParams(this.state.filter))
            .then(response => {
              this.state.count = response.data;
              this.setState(this.state);
            })
            .catch(error => {Utils.onErrorMessage("Couldn't fetch testcases number: " + error.response.data.message)});
     }

     loadMoreTestCases(event){
        this.state.filter.skip = (this.state.filter.skip || 0) + this.testCasesFetchLimit;
        axios
          .get("/api/" + this.props.match.params.project + "/testcase?" + this.getFilterApiRequestParams(this.state.filter))
          .then(response => {
            if (response.data){
                this.state.testcasesTree.testCases = this.state.testcasesTree.testCases.concat(response.data);
                this.setState(this.state);
                this.refreshTree();
            } else {
                this.state.filter.skip = (this.state.filter.skip || 0) - this.testCasesFetchLimit;
                this.setState(this.state);
            }
          })
          .catch(error => {Utils.onErrorMessage("Couldn't fetch testcases: " + error.response.data.message)});
          event.preventDefault();
     }

     getFilterApiRequestParams(filter){
         var tokens = (filter.groups || []).map(function(group){return "groups=" + group});
         filter.filters.forEach(function(filter){
             filter.values.forEach(function(value){
                 tokens.push("attributes." + filter.id + "=" + value);
             })
         });
         if(filter.skip){
            tokens.push("skip=" + filter.skip);
         }
         if (filter.limit){
            tokens.push("limit=" + filter.limit);
         }
         return tokens.join("&");
     }

     onTestcaseSelected(id){
        this.state.selectedTestCase = Utils.getTestCaseFromTree(id, this.state.testcasesTree, function(testCase, id){return testCase.id === id});
        this.props.history.push("/" + this.props.match.params.project + '/testcases?' + this.getQueryParams(this.state.filter));
        this.setState(this.state);
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
            this.onTestcaseSelected(id);
        }.bind(this));
        if (this.state.selectedTestCase.id){
            var node = this.tree.getNodeById(this.state.selectedTestCase.id);
            this.tree.select(node);
            this.state.filter.groups.forEach(function(groupId){
                var attributes = Utils.getTestCaseFromTree(this.state.selectedTestCase.id, this.state.testcasesTree, function(testCase, id){return testCase.id === id}).attributes || {};
                var values = attributes[groupId] || ["None"] ;
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

    showLoadMore(){
        if (((this.state.filter || {}).groups || []).length > 0 || !this.state.count) {
            return false
        }
        return ((this.state.filter || {}).skip || 0) + this.testCasesFetchLimit <= this.state.count;
    }

    render() {
        var that = this;

        return (
            <div>
              <div>
                <TestCasesFilter projectAttributes={this.state.projectAttributes}
                        onFilter={this.onFilter} project={this.props.match.params.project}/>
              </div>

              <div>
                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editTestcase">
                    Add Test Case
                  </button>
                  <div className="modal fade" id="editTestcase" tabIndex="-1" role="dialog" aria-labelledby="editTestcaseLabel" aria-hidden="true">
                      <TestCaseForm project={this.props.match.params.project}
                              testcase={this.state.testcaseToEdit}
                              projectAttributes={this.state.projectAttributes}
                              onTestCaseAdded={this.onTestCaseAdded}/>
                  </div>
              </div>
              <div className="row">
                <div className='sweet-loading'>
                        <FadeLoader
                          sizeUnit={"px"}
                          size={100}
                          color={'#135f38'}
                          loading={this.state.loading}
                        />
                  </div>
                <div className="tree-side col-5">
                    <div id="tree"></div>
                    {this.showLoadMore() && <div><a href="" onClick={this.loadMoreTestCases}>Load more</a></div>}
                </div>
                <div id="testCase" className="testcase-side col-7">
                    {this.state.selectedTestCase && this.state.selectedTestCase.id &&
                        <TestCase projectId={this.props.match.params.project} projectAttributes={this.state.projectAttributes}
                                testcaseId={this.state.selectedTestCase.id}/>
                    }
                </div>
              </div>



            </div>
        );
      }

}

export default TestCases;
