import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import TestCase from '../testcases/TestCase'
import LaunchTestcaseControls from '../launches/LaunchTestcaseControls';
import { Link } from 'react-router-dom';
import axios from "axios";
import * as Utils from '../common/Utils';

import $ from 'jquery';

var jQuery = require('jquery');
window.jQuery = jQuery;
window.jQuery = $;
window.$ = $;
global.jQuery = $;

require('gijgo/js/gijgo.min.js');
require('gijgo/css/gijgo.min.css');

class Launch extends SubComponent {

    state = {
        launch: {},
        selectedTestCase: {
            uuid: null
        }
    };

    constructor(props) {
        super(props);
        this.getLaunch = this.getLaunch.bind(this);
        this.buildTree = this.buildTree.bind(this);
        this.onTestcaseStateChanged = this.onTestcaseStateChanged.bind(this);
        if (this.props.match.params.testcaseUuid){
            this.state.selectedTestCase = {uuid: this.props.match.params.testcaseUuid};
        }
        this.state.projectId = this.props.match.params.project;
    }

    componentDidMount() {
        super.componentDidMount();
        axios
            .get("/api/" + this.state.projectId + "/attribute")
            .then(response => {
                 this.state.projectAttributes = response.data;
                 this.setState(this.state);
            })
            .catch(error => console.log(error));
        this.getLaunch(true);
        this.interval = setInterval(this.getLaunch, 30000);
    }

    getLaunch(buildTree){
        axios
            .get("/api/" + this.state.projectId + "/launch/" + this.props.match.params.launchId)
            .then(response => {
                 this.state.launch = response.data;
                 if (this.state.selectedTestCase.uuid){
                     this.state.selectedTestCase = Utils.getTestCaseFromTree(this.state.selectedTestCase.uuid, this.state.launch.testCaseTree, function(testCase, id){return testCase.uuid === id} );
                 }
                 this.setState(this.state);
                 if (buildTree){
                    this.buildTree();
                 }
                 this.checkUpdatedTestCases();

        })
            .catch(error => console.log(error));
    }

    buildTree(){
        if (this.tree){
            this.tree.destroy()
        }
        this.tree = $("#tree").tree({
            primaryKey: 'uuid',
            uiLibrary: 'bootstrap4',
            imageUrlField: 'statusUrl',
            dataSource: Utils.parseTree(this.state.launch.testCaseTree)
        });

        this.tree.on('select', function (e, node, id) {
            this.state.selectedTestCase = Utils.getTestCaseFromTree(id, this.state.launch.testCaseTree, function(testCase, id){return testCase.uuid === id} );
            this.props.history.push("/" + this.state.projectId + '/launch/' + this.state.launch.id + '/' + id);
            this.setState(this.state);
        }.bind(this));
        if (this.state.selectedTestCase.uuid){
            var node = this.tree.getNodeById(this.state.selectedTestCase.uuid);
            this.tree.select(node);
            this.state.launch.testSuite.filter.groups.forEach(function(groupId){
                var selectedTestCaseInTree = Utils.getTestCaseFromTree(this.state.selectedTestCase.uuid, this.state.launch.testCaseTree, function(testCase, id){return testCase.uuid === id});
                var attributes = selectedTestCaseInTree.attributes || [];
                var attribute = attributes.find(function(attribute){return attribute.id === groupId}) || {} ;
                var values = attribute.values || ["None"];
                values.forEach(function(value){
                    var node = this.tree.getNodeById(groupId + ":" + value);
                    this.tree.expand(node);
                }.bind(this))

            }.bind(this))
        }
    }

    onTestcaseStateChanged(testcase){
        var updatedTestCase = Utils.getTestCaseFromTree(testcase.uuid, this.state.launch.testCaseTree, function(testcase, id){return testcase.uuid === testcase.uuid} );
        Object.assign(updatedTestCase, testcase);
        this.tree.dataSource = Utils.parseTree(this.state.launch.testCaseTree);
        $("li[data-id='" + testcase.uuid + "']").find("img").attr("src", Utils.getStatusUrl(testcase));
    }

    checkUpdatedTestCases(){
        if (!this.testCasesStateMap){
            this.buildTestCasesStateMap(this.state.launch.testCaseTree);
        }
        this.updateTestCasesStateFromLaunch(this.state.launch.testCaseTree);
    }

    updateTestCasesStateFromLaunch(tree){
        tree.testCases.forEach(function(testCase){
            if (this.testCasesStateMap && this.testCasesStateMap[testCase.uuid] !== testCase.launchStatus){
                this.onTestcaseStateChanged(testCase);
            }
        }.bind(this))
        tree.children.forEach(function(child){
            this.updateTestCasesStateFromLaunch(child);
        }.bind(this))
    }

    buildTestCasesStateMap(tree){
        this.testCasesStateMap = {};
        tree.testCases.forEach(function(testCase){
            this.testCasesStateMap[testCase.uuid] = testCase.launchStatus;
        }.bind(this))
        tree.children.forEach(function(child){
            this.buildTestCasesStateMap(child);
        }.bind(this))
    }

    render() {
        return (
          <div>
              <div className="row">
                  <div className="tree-side col-5">
                      <div id="tree"></div>
                  </div>
                  <div id="testCase" className="testcase-side col-7">
                      <TestCase
                        testcase={this.state.selectedTestCase}
                        projectAttributes={this.state.projectAttributes}
                        readonly={true}
                      />
                      <LaunchTestcaseControls
                        testcase={this.state.selectedTestCase}
                        launchId={this.state.launch.id}
                        projectId={this.state.projectId}
                        callback={this.onTestcaseStateChanged}
                      />
                  </div>
                </div>
          </div>
        );
      }

}

export default Launch;
