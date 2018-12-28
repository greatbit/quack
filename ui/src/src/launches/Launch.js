import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
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
        launch: {}
    };

    constructor(props) {
        super(props);
        this.getLaunch = this.getLaunch.bind(this);
        this.buildTree = this.buildTree.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.getLaunch();
    }

    getLaunch(){
        axios
            .get("/api/" + this.props.match.params.project + "/launch/" + this.props.match.params.launchId)
            .then(response => {
                 this.state.launch = response.data;
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

    }

    render() {
        return (
          <div>
              <div className="row">
                  <div className="tree-side col-5">
                      <div id="tree"></div>
                  </div>
                  <div id="testCase" className="testcase-side col-7">
                      Current Testcase Here
                  </div>
                </div>
          </div>
        );
      }

}

export default Launch;
