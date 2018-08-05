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
        },
        projectAttributes: []
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
        $("#editTestcase").modal('show');
     }


     onTestCaseAdded(testcase){
     }


    render() {
        var that = this;
        return (
          <div>
              <div>
                <ul>{
                    this.state.testcases.map(function(testcase, i){
                        return <li>
                            <Link to={"/" + that.props.match.params.project + "/testcases/" + testcase.id}>{testcase.name}</Link>
                            <span onClick={(e) => that.editTestcase(testcase.id)}>Edit</span>
                        </li>
                    })
                }</ul>
              </div>
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editTestcase">
                Add
              </button>
              <div className="modal fade" id="editTestcase" tabindex="-1" role="dialog" aria-labelledby="editTestcaseLabel" aria-hidden="true">
                  <TestCaseForm project={this.props.match.params.project}
                          testcase={this.state.testcaseToEdit}
                          projectAttributes={this.state.projectAttributes}
                          onTestCaseAdded={this.onTestCaseAdded}/>
              </div>
          </div>
        );
      }

}

export default TestCases;
