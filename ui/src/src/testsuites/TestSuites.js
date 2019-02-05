import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import axios from "axios";

class TestSuites extends SubComponent {

    state = {
        testSuites: [],
        testSuitesToDisplay: []
    };


    constructor(props) {
        super(props);
        this.getTestSuites = this.getTestSuites.bind(this);
        this.onFilter = this.onFilter.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.getTestSuites();
    }

    getTestSuites(){
        axios
            .get("/api/" + this.props.match.params.project + "/testsuite")
            .then(response => {
                 this.state.testSuites = response.data;
                 this.state.testSuitesToDisplay = this.state.testSuites.slice();
                 this.setState(this.state);
        })
            .catch(error => console.log(error));
    }

    onFilter(event){
        var token = (event.target.value || "").toLowerCase();
        this.state.testSuitesToDisplay = this.state.testSuites.filter(testSuite =>
                (testSuite.name || "").toLowerCase().includes(token));
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
            <div className="row">
                {this.state.testSuitesToDisplay.map(function(testSuite){
                    return (
                            <div className="col-sm-6">
                                <div className="card testsuite-card col-sm-10">
                                  <div className="card-body">
                                    <h5 className="card-title">
                                        {testSuite.name}
                                    </h5>
                                    <p className="card-text">
                                        <Link to={'/' + this.props.match.params.project + '/testcases?testSuite=' + testSuite.id}>
                                            View
                                        </Link>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-sm-1"></div>
                            </div>
                           );
                }.bind(this))}
            </div>
          </div>
        );
      }

}

export default TestSuites;
