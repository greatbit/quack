import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SubComponent from '../common/SubComponent'
import TestCase from '../testcases/TestCase'
import LaunchTestcaseControls from '../launches/LaunchTestcaseControls';
import { Link } from 'react-router-dom';
import axios from "axios";
import * as Utils from '../common/Utils';
import { FadeLoader } from 'react-spinners';
import * as ReactD3 from 'react-d3-components';


import $ from 'jquery';

var jQuery = require('jquery');
window.jQuery = jQuery;
window.jQuery = $;
window.$ = $;
global.jQuery = $;

require('gijgo/js/gijgo.min.js');
require('gijgo/css/gijgo.min.css');

var PieChart = ReactD3.PieChart;

class Launch extends SubComponent {

    state = {
        launch: {
            launchStats: {
                statusCounters: {}
            },
            testSuite: {}
        },
        selectedTestCase: {
            uuid: null
        },
        loading: true
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
        this.showLaunchStats = this.showLaunchStats.bind(this);
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
                 this.state.loading = false;
                 this.setState(this.state);
                 if (buildTree){
                    this.buildTree();
                 }
                 this.checkUpdatedTestCases();

        }).catch(error => {
            Utils.onErrorMessage("Couldn't get launch: " + error.message);
            this.state.loading = false;
            this.setState(this.state);
        });
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

    showLaunchStats(event){
        this.state.selectedTestCase.id = null;
        this.setState(this.state);
    }

    render() {
        return (
          <div>
              <div>
                <h3>
                    <Link to={'/' + this.state.projectId + '/launch/' + this.state.launch.id} onClick={this.showLaunchStats}>
                        {this.state.launch.name}
                    </Link>
                </h3>

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
                  </div>
                  <div id="testCase" className="testcase-side col-7">
                     {this.state.selectedTestCase.id &&
                          <TestCase
                            testcase={this.state.selectedTestCase}
                            projectAttributes={this.state.projectAttributes}
                            readonly={true}
                          />
                      }
                      {this.state.selectedTestCase.id &&
                            <LaunchTestcaseControls
                                testcase={this.state.selectedTestCase}
                                launchId={this.state.launch.id}
                                projectId={this.state.projectId}
                                callback={this.onTestcaseStateChanged}
                            />
                      }
                      {!this.state.selectedTestCase.id &&
                              <div>
                               {this.state.launch.testSuite.id &&
                                <div className="row">
                                    <div className="col-4">
                                        <Link to={'/' + this.state.projectId + '/testcases?testSuite=' + this.state.launch.testSuite.id} >
                                            {this.state.launch.testsuite.name}
                                        </Link>
                                    </div>
                                </div>
                                }
                                <div className="row">
                                    <div className="col-4">
                                        Created at: {Utils.timeToDate(this.state.launch.createdTime)}
                                    </div>
                                    <div className="col-4">
                                        Started at: {Utils.timeToDate(this.state.launch.startTime)}
                                    </div>
                                    <div className="col-4">
                                        Finished at: {Utils.timeToDate(this.state.launch.finishTime)}
                                    </div>
                                </div>
                                <div className="progress">
                                  <div class="progress-bar progress-bar-striped" role="progressbar" style={Utils.getProgressBarStyle(this.state.launch.launchStats.statusCounters.RUNNING, this.state.launch.launchStats.total)}>
                                    {Utils.getProgressBarNumber(this.state.launch.launchStats.statusCounters.RUNNING, this.state.launch.launchStats.total)}
                                  </div>
                                  <div class="progress-bar bg-success" role="progressbar" style={Utils.getProgressBarStyle(this.state.launch.launchStats.statusCounters.PASSED, this.state.launch.launchStats.total)}>
                                    {Utils.getProgressBarNumber(this.state.launch.launchStats.statusCounters.PASSED, this.state.launch.launchStats.total)}
                                  </div>
                                  <div class="progress-bar bg-danger" role="progressbar" style={Utils.getProgressBarStyle(this.state.launch.launchStats.statusCounters.FAILED, this.state.launch.launchStats.total)}>
                                    {Utils.getProgressBarNumber(this.state.launch.launchStats.statusCounters.FAILED, this.state.launch.launchStats.total)}
                                  </div>
                                  <div class="progress-bar bg-warning" role="progressbar" style={Utils.getProgressBarStyle(this.state.launch.launchStats.statusCounters.BROKEN, this.state.launch.launchStats.total)}>
                                    {Utils.getProgressBarNumber(this.state.launch.launchStats.statusCounters.BROKEN, this.state.launch.launchStats.total)}
                                  </div>
                                </div>
                              </div>
                        }
                  </div>
                </div>
          </div>
        );
      }

}

export default withRouter(Launch);
