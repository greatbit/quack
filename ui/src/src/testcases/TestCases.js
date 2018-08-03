import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import TestCaseForm from '../testcases/TestCaseForm'
import axios from "axios";
import $ from 'jquery';

class TestCases extends SubComponent {
    state = {
        testcases: [],
        testcaseToEdit: {
            id: null,
            name: ""
        }
    };

    componentDidMount() {
        super.componentDidMount();
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
     }

     onTestCaseAdded(testcase){
     }


    render() {
        var that = this;
        return (
          <div>
              <div>
                <ul>{
                    this.state.testcases.map(function(testcase){
                        return <li><Link to={"/" + that.props.match.params.project + "/testcases/" + testcase.id}>{testcase.name}</Link></li>;
                    })
                }</ul>
              </div>
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editTestcase">
                Add
              </button>
              <div className="modal fade" id="editTestcase" tabindex="-1" role="dialog" aria-labelledby="editTestcaseLabel" aria-hidden="true">
                  <TestCaseForm project={this.props.match.params.project}
                          testcase={this.state.testcaseToEdit}
                          onTestCaseAdded={this.onTestCaseAdded}/>
              </div>
          </div>
        );
      }

}

export default TestCases;
