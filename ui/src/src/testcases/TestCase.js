import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

class TestCase extends SubComponent {
    constructor(props) {
        super(props);
        this.state = {
             testcase: {
                 id: null,
                 name: "",
                 description: "",
                 steps: [],
                 attributes: []
             }
         };
         this.getTestCase = this.getTestCase.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.toggleEdit = this.toggleEdit.bind(this);
      }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.testcaseId){
            this.getTestCase(this.props.projectId, this.props.testcaseId);
        } else if(this.props.match) {
            this.getTestCase(this.props.match.params.project, this.props.match.params.testcase);
        }
     }

    componentWillReceiveProps(nextProps) {
      if(nextProps.testcaseId){
        this.getTestCase(nextProps.projectId, nextProps.testcaseId);
      }
      if (nextProps.projectAttributes){
        this.state.projectAttributes = nextProps.projectAttributes;
      }
      this.setState(this.state);
    }

    getTestCase(projectId, testcaseId){
        axios
          .get("/api/"  + projectId + "/testcase/"+ testcaseId)
          .then(response => {
            const newState = Object.assign({}, this.state, {
                testcase: response.data
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));
    }

    handleSubmit(){}

    toggleEdit(field, event){
        $("#" + field + "-display").toggle();
        $("#" + field + "-form").toggle();
    }


    render() {
        return (
            <div>
              <div id="name">
                <div id="name-display" className="inplace-display">
                    <h1>{this.state.testcase.name}
                        <span className="glyphicon glyphicon-pencil edit clickable" field="name" onClick={(e) => this.toggleEdit("name", e)}><FontAwesomeIcon icon={faEdit}/></span>
                    </h1>
                </div>
                <div id="name-form" className="inplace-form" style={{display: 'none'}}>
                    <form>
                        <input type="text" name="name" value={this.state.testcase.name}/>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Save</button>
                    </form>
                </div>
              </div>


              <span>
                Description: {this.state.testcase.description}
              </span>
            </div>
        );
      }

}

export default TestCase;
