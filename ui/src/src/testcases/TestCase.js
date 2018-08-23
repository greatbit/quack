import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import CreatableSelect from 'react-select/lib/Creatable';

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
             originalTestcase: {
                steps: [],
                attributes: []
             },
             projectAttributes: []
         };
         this.getTestCase = this.getTestCase.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.toggleEdit = this.toggleEdit.bind(this);
         this.handleChange = this.handleChange.bind(this);
         this.cancelEdit = this.cancelEdit.bind(this);
         this.getAttributeName = this.getAttributeName.bind(this);
         this.getAttributeValues = this.getAttributeValues.bind(this);
         this.getAttribute = this.getAttribute.bind(this);
         this.editAttributeValues = this.editAttributeValues.bind(this);
         this.cancelEditAttributeValues = this.cancelEditAttributeValues.bind(this);
         this.removeAttribute = this.removeAttribute.bind(this);
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

    handleChange(fieldName, event, index){
        if (index){
            this.state.testcase[fieldName][index] = event.target.value;
        } else {
            this.state.testcase[fieldName] = event.target.value;
        }

        this.setState(this.state);
    }

    cancelEdit(fieldName, event, index){
        if (index){
            this.state.testcase[fieldName][index] = this.state.originalTestcase[fieldName][index];
        } else {
            this.state.testcase[fieldName] = this.state.originalTestcase[fieldName];
        }

        this.setState(this.state);
        this.toggleEdit(fieldName, event, index);
    }

    handleSubmit(fieldName, event, index){
        axios.put('/api/' + this.projectId + '/testcase/', this.state.testcase)
            .then(response => {
                this.state.testcase = response.data;
                this.setState(this.state);
                this.toggleEdit(fieldName, event, index);
        })
        event.preventDefault();

    }

    toggleEdit(fieldName, event, index){
        var fieldId = fieldName;
        if (index){
            fieldId = fieldId + "-" + index;
        }

        if($("#" + fieldId + "-display").is(":visible")){
            if (index){
                this.state.originalTestcase[fieldName][index] = this.state.testcase[fieldName][index];
            } else {
                this.state.originalTestcase[fieldName] = this.state.testcase[fieldName];
            }
        }

        $("#" + fieldId + "-display").toggle();
        $("#" + fieldId + "-form").toggle();
    }

    getAttribute(id){
        return this.state.projectAttributes.find(function(attribute){return attribute.id === id}) || {}
    }

    getAttributeName(id){
        return this.getAttribute(id).name || ""
    }

    getAttributeValues(id){
        return this.getAttribute(id).values || []
    }

    editAttributeValues(index, values){
        this.state.originalTestcase["attributes"][index] = this.state.testcase["attributes"][index];
        this.state.testcase["attributes"][index].values = values.map(function(value){return value.value});
        this.setState(this.state);
    }

    cancelEditAttributeValues(event, index){
        this.state.testcase["attributes"][index] = this.state.originalTestcase["attributes"][index];
        this.setState(this.state);
        this.toggleEdit("attributes", event, index);
    }

    removeAttribute(i, event){
        this.state.testcase.attributes.splice(i, 1);
        this.setState(this.state);
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
                        <input type="text" name="name" onChange={(e) => this.handleChange("name", e)} value={this.state.testcase.name}/>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={(e) => this.cancelEdit("name", e)}>Cancel</button>
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
                        <textarea rows="7" cols="50" name="description" onChange={(e) => this.handleChange("description", e)}>{this.state.testcase.description}</textarea>
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={(e) => this.cancelEdit("description", e)}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("description", e)}>Save</button>
                    </form>
                </div>
              </div>

              <div id="preconditions">
                  <h5>
                      Preconditions
                      <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("preconditions", e)}><FontAwesomeIcon icon={faEdit}/></span>
                  </h5>
                  <div id="preconditions-display" className="inplace-display">
                      {this.state.testcase.preconditions}
                  </div>
                  <div id="preconditions-form" className="inplace-form" style={{display: 'none'}}>
                      <form>
                          <textarea rows="7" cols="50" name="preconditions" onChange={(e) => this.handleChange("preconditions", e)}>{this.state.testcase.preconditions}</textarea>
                          <button type="button" className="btn btn-secondary" onClick={(e) => this.cancelEdit("preconditions", e)}>Cancel</button>
                          <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("preconditions", e)}>Save</button>
                      </form>
                  </div>
              </div>

              <div id="attributes">
                <h5>
                    Attributes
                </h5>
                {
                  (this.state.testcase.attributes || []).map(function(attribute, i){
                      return (
                          <div className="row">
                              <div id={"attributes-" + i + "-display"} className="inplace-display">
                                <div index={i}>
                                  {this.getAttributeName(attribute.id)}
                                  <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("attributes", e, i)}><FontAwesomeIcon icon={faEdit}/></span>
                                  <span index={i} onClick={(e) => this.removeAttribute(i, e)}>X</span>
                                </div>
                              </div>
                              <div id={"attributes-" + i + "-form"} className="inplace-form" style={{display: 'none'}}>
                                <form>
                                  <div index={i}>
                                    {this.getAttributeName(attribute.id)}
                                    <CreatableSelect value={(attribute.values || []).map(function(val){return {value: val, label: val}})}
                                      isMulti
                                      isClearable
                                      onChange={(e) => this.editAttributeValues(i, e)}
                                      options={this.getAttributeValues(attribute.id).map(function(val){return {value: val, label: val}})}
                                     />
                                  </div>
                                  <button type="button" className="btn btn-secondary" onClick={(e) => this.cancelEditAttributeValues(e, i)}>Cancel</button>
                                  <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("attributes", e, i)}>Save</button>
                                </form>
                              </div>
                          </div>
                      );
                    }.bind(this))
                  }

              </div>
            </div>
        );
      }

}

export default TestCase;
