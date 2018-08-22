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
             },
             originalTestcase: {}
         };
         this.getTestCase = this.getTestCase.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.toggleEdit = this.toggleEdit.bind(this);
         this.handleChange = this.handleChange.bind(this);
         this.cancelEdit = this.cancelEdit.bind(this);
      }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.testcaseId){
            this.projectId = this.props.projectId;
            this.getTestCase(this.props.projectId, this.props.testcaseId);
        } else if(this.props.match) {
            this.projectId = this.props.match.params.project;
            this.getTestCase(this.props.match.params.project, this.props.match.params.testcase);
        }
     }

    componentWillReceiveProps(nextProps) {
      if(nextProps.testcaseId){
        this.projectId = nextProps.projectId;
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

    handleChange(event){
        this.state.originalTestcase[event.target.name] = this.state.testcase[event.target.name];
        this.state.testcase[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    cancelEdit(fieldName, event){
        this.state.testcase[event.target.name] = this.state.originalTestcase[event.target.name];
        this.setState(this.state);
        this.toggleEdit(fieldName, event);
    }

    handleSubmit(fieldName, event){
        axios.put('/api/' + this.projectId + '/testcase/', this.state.testcase)
            .then(response => {
                this.state.testcase = response.data;
                this.setState(this.state);
                this.toggleEdit(fieldName, event);
        })
        event.preventDefault();

    }

    toggleEdit(fieldName, event){
        $("#" + fieldName + "-display").toggle();
        $("#" + fieldName + "-form").toggle();
    }


    render() {
        return (
            <div>
              <div id="name">
                <div id="name-display" className="inplace-display">
                    <h1>{this.state.testcase.name}
                        <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("name", e)}><FontAwesomeIcon icon={faEdit}/></span>
                    </h1>
                </div>
                <div id="name-form" className="inplace-form" style={{display: 'none'}}>
                    <form>
                        <input type="text" name="name" onChange={this.handleChange} value={this.state.testcase.name}/>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={(e) => this.cancelEdit("name", e)}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("name", e)}>Save</button>
                    </form>
                </div>
              </div>

                <div id="description">
                    <h5>
                        Description
                        <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("description", e)}><FontAwesomeIcon icon={faEdit}/></span>
                    </h5>
                    <div id="description-display" className="inplace-display">
                    {this.state.testcase.description}
                </div>
                <div id="description-form" className="inplace-form" style={{display: 'none'}}>
                    <form>
                        <textarea rows="7" cols="50" name="description" onChange={this.handleChange}>{this.state.testcase.description}</textarea>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={(e) => this.cancelEdit("description", e)}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("description", e)}>Save</button>
                    </form>
                </div>
              </div>
            </div>
        );
      }

}

export default TestCase;
