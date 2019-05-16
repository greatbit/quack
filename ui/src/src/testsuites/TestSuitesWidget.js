import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import qs from 'qs';
import { Link } from 'react-router-dom';
import axios from "axios";
import * as Utils from '../common/Utils';
import { FadeLoader } from 'react-spinners';

class TestSuitesWidget extends SubComponent {

    state = {
        testSuites: [],
        testSuitesToDisplay: [],
        loading: true
    };


    constructor(props) {
        super(props);
        this.limit = props.limit || 5;
        this.state.projectId = props.projectId;
        this.getTestSuites = this.getTestSuites.bind(this);
        this.onFilter = this.onFilter.bind(this);
    }

     componentWillReceiveProps(nextProps) {
        var nextProjectId = nextProps.projectId;
        if(nextProjectId && this.state.projectId != nextProjectId){
            this.state.projectId = nextProjectId;
            this.getTestSuites();
        }
     }

    componentDidMount() {
        super.componentDidMount();
        if (this.state.projectId){
            this.getTestSuites();
        }

    }

    getTestSuites(){
        axios
            .get("/api/" + this.state.projectId + "/testsuite")
            .then(response => {
                 this.state.testSuites = response.data;
                 this.state.testSuitesToDisplay = this.state.testSuites.slice(0, this.limit);
                 this.state.loading = false;
                 this.setState(this.state);
        }).catch(error => {
            Utils.onErrorMessage("Couldn't get testsuites: " + error.response.data.message);
            this.state.loading = false;
            this.setState(this.state);
        });
    }

    onFilter(event){
        var token = (event.target.value || "").toLowerCase();
        this.state.testSuitesToDisplay = this.state.testSuites.filter(testSuite =>
                (testSuite.name || "").toLowerCase().includes(token)).slice(0, this.limit);
        this.setState(this.state);
    }

    render() {
        return (
          <div>
            <div className="row">
                <form className="col-sm-5">
                  <div class="form-group">
                    <input type="text" class="form-control" id="filter" placeholder="Filter" onChange={this.onFilter}/>
                  </div>
                </form>
            </div>
            <div>
                <div className='sweet-loading'>
                       <FadeLoader
                         sizeUnit={"px"}
                         size={100}
                         color={'#135f38'}
                         loading={this.state.loading}
                       />
                 </div>
                {this.state.testSuitesToDisplay.map(function(testSuite){
                    return (
                            <div>
                                <Link to={'/' + this.projectId + '/testcases?testSuite=' + testSuite.id}>
                                    {testSuite.name}
                                </Link>
                            </div>
                           );
                }.bind(this))}
            </div>
          </div>
        );
      }

}

export default TestSuitesWidget;
