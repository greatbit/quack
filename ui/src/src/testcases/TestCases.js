import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import TestCaseForm from '../testcases/TestCaseForm'
import TestCasesFilter from '../testcases/TestCasesFilter'
import axios from "axios";
import $ from 'jquery';

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
        projectAttributes: []
    };

    constructor(props) {
        super(props);
        this.onFilter = this.onFilter.bind(this);
        this.parseTree = this.parseTree.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();

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



        /////////TREE
          axios
            .get("/api/" + this.props.match.params.project + "/testcase/tree")
            .then(response => {
              this.state.testcasesTree = response.data
              this.setState(this.state);
            })
            .catch(error => console.log(error));


          axios
            .get("/api/" + this.props.match.params.project + "/attribute")
            .then(response => {
                 this.state.projectAttributes = response.data;
                 this.setState(this.state);
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
        axios
          .get("/api/" + this.props.match.params.project + "/testcase/tree?" + this.getFilterApiRequestParams(filter))
          .then(response => {
            this.state.testcasesTree = response.data;
            this.setState(this.state);
          })
          .catch(error => console.log(error));
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

     parseTree(){
        return this.getTreeNode(this.state.testcasesTree).children || [];
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

     componentDidUpdate(){
        if (this.tree){
            this.tree.destroy()
        }
        this.tree = $("#tree").tree({
            primaryKey: 'id',
            uiLibrary: 'bootstrap4',
            dataSource: this.parseTree()
        });
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

              <div id="tree"></div>


            </div>
        );
      }

}

export default TestCases;
