import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import TestCase from '../testcases/TestCase'
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
        if (this.props.match.params.testcaseUuid){
            this.state.selectedTestCase = {uuid: this.props.match.params.testcaseUuid};
        }
    }

    componentDidMount() {
        super.componentDidMount();
        axios
            .get("/api/" + this.props.match.params.project + "/attribute")
            .then(response => {
                 this.state.projectAttributes = response.data;
                 this.setState(this.state);
                 this.refreshTree();
            })
            .catch(error => console.log(error));
        this.getLaunch();
    }

    getLaunch(){
        axios
            .get("/api/" + this.props.match.params.project + "/launch/" + this.props.match.params.launchId)
            .then(response => {
                 this.state.launch = response.data;
                 if (this.state.selectedTestCase.uuid){
                     this.state.selectedTestCase = Utils.getTestCaseFromTree(this.state.selectedTestCase.uuid, this.state.launch.testCaseTree, function(testCase, id){return testCase.uuid === id} );
                 }
                 this.setState(this.state);
                 this.buildTree();

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
            dataSource: Utils.parseTree(this.state.launch.testCaseTree)
        });
        this.tree.on('select', function (e, node, id) {
            this.state.selectedTestCase = Utils.getTestCaseFromTree(id, this.state.launch.testCaseTree, function(testCase, id){return testCase.uuid === id} );
            this.props.history.push("/" + this.props.match.params.project + '/launch/' + this.state.launch.id + '/' + id);
            this.setState(this.state);
        }.bind(this));
//        ToDo: expand tree if got to LaunchTestCase by url
//        if (this.state.selectedTestCase.id){
//            var node = this.tree.getNodeById(this.state.selectedTestCase.uuid);
//            this.tree.select(node);
//            this.state.filter.groups.forEach(function(groupId){
//                var attributes = this.getTestCaseFromTree(this.state.selectedTestCase.id).attributes || [];
//                var attribute = attributes.find(function(attribute){return attribute.id === groupId}) || {} ;
//                var values = attribute.values || ["None"];
//                values.forEach(function(value){
//                    var node = this.tree.getNodeById(groupId + ":" + value);
//                    this.tree.expand(node);
//                }.bind(this))
//
//            }.bind(this))
//        }

    }

    render() {
        return (
          <div>
              <div className="row">
                  <div className="tree-side col-5">
                      <div id="tree"></div>
                  </div>
                  <div id="testCase" className="testcase-side col-7">
                      <TestCase testcase={this.state.selectedTestCase} projectAttributes={this.state.projectAttributes} />
                  </div>
                </div>
          </div>
        );
      }

}

export default Launch;
