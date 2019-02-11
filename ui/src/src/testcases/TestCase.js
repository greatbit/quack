import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import CreatableSelect from 'react-select/lib/Creatable'

class TestCase extends SubComponent {
    constructor(props) {
        super(props);
        this.state = {
             testcase: {
                 id: null,
                 name: "",
                 description: "",
                 steps: [],
                 attributes: {}
             },
             originalTestcase: {
                steps: [],
                attributes: {}
             },
             projectAttributes: [],
             readonly: false
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
         this.cancelEditAttributeKey = this.cancelEditAttributeKey.bind(this);
         this.removeAttribute = this.removeAttribute.bind(this);
         this.addAttribute = this.addAttribute.bind(this);
         this.editAttributeKey = this.editAttributeKey.bind(this);
         this.handleStepActionChange = this.handleStepActionChange.bind(this);
         this.handleStepExpectationChange = this.handleStepExpectationChange.bind(this);
         this.addStep = this.addStep.bind(this);
         this.removeStep = this.removeStep.bind(this);
      }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.readonly){
            this.state.readonly = true;
        }
        if (this.props.testcase){
            this.state.testcase = this.props.testcase;
        } else if (this.props.testcaseId){
            this.projectId = this.props.projectId;
            this.getTestCase(this.props.projectId, this.props.testcaseId);
        } else if(this.props.match) {
            this.projectId = this.props.match.params.project;
            this.getTestCase(this.props.match.params.project, this.props.match.params.testcase);
        }
     }

    componentWillReceiveProps(nextProps) {
      if (nextProps.testcase){
        this.state.testcase = nextProps.testcase;
      } else if(nextProps.testcaseId){
        this.projectId = nextProps.projectId;
        this.getTestCase(nextProps.projectId, nextProps.testcaseId);
      }
      if (nextProps.projectAttributes){
        this.state.projectAttributes = nextProps.projectAttributes;
      }
      this.setState(this.state);
    }

    componentDidUpdate(){
        Object.keys(this.state.testcase.attributes || {}).forEach(function(attributeId, index){
            var attributeValues = this.state.testcase.attributes[attributeId];
            if (attributeId && (
                    attributeValues === undefined || attributeValues === null || attributeValues.length == 0)
                ){
                this.toggleEdit("attributes", null, index);
            }

        }.bind(this))

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

    handleSubmit(fieldName, event, index, ignoreToggleEdit){
        axios.put('/api/' + this.projectId + '/testcase/', this.state.testcase)
            .then(response => {
                this.state.testcase = response.data;
                this.setState(this.state);
                if (!ignoreToggleEdit){
                    this.toggleEdit(fieldName, event, index);
                }

        })
        event.preventDefault();

    }

    toggleEdit(fieldName, event, index){
        var fieldId = fieldName;
        if (index !== undefined){
            fieldId = fieldId + "-" + index;
        }
        if($("#" + fieldId + "-display").offsetParent !== null){
            if (index){
                this.state.originalTestcase[fieldName][index] = this.state.testcase[fieldName][index];
            } else {
                this.state.originalTestcase[fieldName] = this.state.testcase[fieldName];
            }
        }
        $("#" + fieldId + "-display").toggle();
        $("#" + fieldId + "-form").toggle();
        if (event){
            event.preventDefault();
        }

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

    editAttributeValues(key, values){
        this.state.originalTestcase["attributes"][key] = this.state.testcase["attributes"][key];
        this.state.testcase["attributes"][key] = values.map(function(value){return value.value});
        this.setState(this.state);
    }

    cancelEditAttributeValues(event, key){
        this.state.testcase["attributes"][key] = this.state.originalTestcase["attributes"][key];
        this.setState(this.state);
        this.toggleEdit("attributes", event, key);
    }

    cancelEditAttributeKey(event, key){
        if (key === undefined ||
           this.state.testcase.attributes[key].values === undefined ||
           this.state.testcase.attributes[key].values === null ||
           this.state.testcase.attributes[key].values.length == 0)
        delete this.state.testcase.attributes[key];
        this.setState(this.state);
    }

    removeAttribute(key, event){
        delete this.state.testcase.attributes[key];
        this.setState(this.state);
    }

    addAttribute(event){
        if (!this.state.testcase.attributes){
            this.state.testcase.attributes = {};
        }
        this.state.testcase.attributes[null] = [];
        this.setState(this.state);
    }

    editAttributeKey(key, data){
        this.state.testcase.attributes[data.value] = this.state.testcase.attributes[key];
        delete this.state.testcase.attributes[key];
        this.setState(this.state);
    }

    handleStepActionChange(index, event, reRender){
        this.state.testcase.steps[index].action = event.target.value;
        if (reRender){
            this.setState(this.state);
        }
    }

    handleStepExpectationChange(index, event, reRender){
        this.state.testcase.steps[index].expectation = event.target.value;
        if (reRender){
            this.setState(this.state);
        }
    }

    addStep(){
        if (!this.state.testcase.steps){
            this.state.testcase.steps = [];
        }
        this.state.testcase.steps.push({});
        this.setState(this.state);
    }

    removeStep(event, index){
        this.state.testcase.steps.splice(index, 1);
        this.setState(this.state);
        this.handleSubmit("steps", event, index, true);
    }

    render() {
        return (
            <div>
              <div id="name" className="testcase-section">
                <div id="name-display" className="inplace-display">
                    <h1>{this.state.testcase.name}
                        {!this.state.readonly &&
                            <span className="edit edit-icon clickable" onClick={(e) => this.toggleEdit("name", e)}><FontAwesomeIcon icon={faPencilAlt}/></span>
                        }
                    </h1>
                </div>
                {!this.state.readonly &&
                    <div id="name-form" className="inplace-form" style={{display: 'none'}}>
                        <form>
                            <input type="text" name="name" onChange={(e) => this.handleChange("name", e)} value={this.state.testcase.name}/>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={(e) => this.cancelEdit("name", e)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("name", e)}>Save</button>
                        </form>
                    </div>
                }
              </div>

              <div id="description" className="testcase-section">
                <h5>
                    Description
                    {!this.state.readonly &&
                        <span className="edit edit-icon clickable" onClick={(e) => this.toggleEdit("description", e)}><FontAwesomeIcon icon={faPencilAlt}/></span>
                    }
                </h5>
                <div id="description-display" className="inplace-display">
                    {this.state.testcase.description}
                </div>
                {!this.state.readonly &&
                    <div id="description-form" className="inplace-form" style={{display: 'none'}}>
                        <form>
                            <textarea rows="7" cols="50" name="description" onChange={(e) => this.handleChange("description", e)} value={this.state.testcase.description}></textarea>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={(e) => this.cancelEdit("description", e)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("description", e)}>Save</button>
                        </form>
                    </div>
                }
              </div>

              <div id="preconditions" className="testcase-section">
                  <h5>
                      Preconditions
                      {!this.state.readonly &&
                        <span className="edit edit-icon clickable" onClick={(e) => this.toggleEdit("preconditions", e)}><FontAwesomeIcon icon={faPencilAlt}/></span>
                      }
                  </h5>
                  <div id="preconditions-display" className="inplace-display">
                      {this.state.testcase.preconditions}
                  </div>
                  {!this.state.readonly &&
                      <div id="preconditions-form" className="inplace-form" style={{display: 'none'}}>
                          <form>
                              <textarea rows="7" cols="50" name="preconditions" onChange={(e) => this.handleChange("preconditions", e)} value={this.state.testcase.preconditions}></textarea>
                              <button type="button" className="btn btn-secondary" onClick={(e) => this.cancelEdit("preconditions", e)}>Cancel</button>
                              <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("preconditions", e)}>Save</button>
                          </form>
                      </div>
                  }
              </div>

              <div id="steps" className="testcase-section">
                  <h5>
                      Steps
                  </h5>
                  {
                    (this.state.testcase.steps || []).map(function(step, i){
                        if(!step || (!step.action && !step.expectation)){
                          return (
                            <div className="row">
                                <div id={"steps-" + i + "-form"} index={i} className="inplace-form card col-md-12">
                                      <div className="card-body">
                                        <h6 className="card-subtitle mb-2 text-muted">{i + 1}. Step</h6>
                                        <p className="card-text">
                                          <textarea rows="5" cols="60" name="step.action" onChange={(e) => this.handleStepActionChange(i, e, false)} value={this.state.testcase.steps[i].action}/>
                                        </p>
                                        <h6 className="card-subtitle mb-2 text-muted">Expectations</h6>
                                        <p className="card-text">
                                          <textarea rows="5" cols="60" name="step.expectation" onChange={(e) => this.handleStepExpectationChange(i, e, false)} value={this.state.testcase.steps[i].expectation}/>
                                        </p>
                                        <button type="button" className="btn btn-secondary" onClick={(e) => this.removeStep(e, i)}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("steps", e, i, true)}>Save</button>
                                      </div>
                                  </div>
                            </div>
                          )
                          } else {
                            return (
                              <div className="row">
                                  <div id={"steps-" + i + "-display"} className="inplace-display col-sm-12">
                                      <div index={i} className="row">
                                          <div className="card col-md-12">
                                            <div className="card-body">
                                              <h6 className="card-subtitle mb-2 text-muted">{i + 1}. Step</h6>
                                              <p className="card-text">{this.state.testcase.steps[i].action}</p>

                                              <h6 className="card-subtitle mb-2 text-muted">Expectations</h6>
                                              <p className="card-text">{this.state.testcase.steps[i].expectation}</p>

                                              {!this.state.readonly &&
                                                <a href="#" className="card-link" onClick={(e) => this.toggleEdit("steps", e, i)}>Edit</a>
                                              }

                                              {!this.state.readonly &&
                                                <a href="#" className="card-link red" onClick={(e) => this.removeStep(e, i)}>Remove</a>
                                              }
                                            </div>
                                          </div>
                                      </div>
                                  </div>
                                  {!this.state.readonly &&
                                      <div id={"steps-" + i + "-form"} index={i} className="inplace-form card col-md-12" style={{display: 'none'}}>
                                          <div className="card-body">
                                            <h6 className="card-subtitle mb-2 text-muted">{i + 1}. Step</h6>
                                            <p className="card-text">
                                              <textarea rows="5" cols="60" name="step.action" onChange={(e) => this.handleStepActionChange(i, e, true)} value={this.state.testcase.steps[i].action}/>
                                            </p>
                                            <h6 className="card-subtitle mb-2 text-muted">Expectations</h6>
                                            <p className="card-text">
                                              <textarea rows="5" cols="60" name="step.expectation" onChange={(e) => this.handleStepExpectationChange(i, e, true)} value={this.state.testcase.steps[i].expectation}/>
                                            </p>
                                            <button type="button" className="btn btn-outline-secondary" onClick={(e) => this.cancelEdit("steps", e, i)}>Cancel</button>
                                            <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("steps", e, i)}>Save</button>
                                          </div>
                                      </div>
                                  }
                              </div>
                          )}

                      }.bind(this))
                    }
                    {!this.state.readonly &&
                        <div className="row">
                          <button type="button" className="btn btn-primary" onClick={this.addStep}>
                             Add
                          </button>
                        </div>
                    }
               </div>

              <div id="attributes" className="testcase-section">
                <h5>
                    Attributes
                </h5>
                {
                  Object.keys(this.state.testcase.attributes || {}).map(function(attributeId, i){
                      var attributeValues = this.state.testcase.attributes[attributeId] || [];
                      if(attributeId && attributeId != "null"){
                        return (
                          <div className="row">
                              <div id={"attributes-" + attributeId + "-display"} className="inplace-display">
                                <div index={attributeId}>
                                  <div>
                                    <b>{this.getAttributeName(attributeId)}</b>
                                    {!this.state.readonly &&
                                        <span className="edit edit-icon clickable" onClick={(e) => this.toggleEdit("attributes", e, attributeId)}><FontAwesomeIcon icon={faPencilAlt}/></span>
                                    }
                                    {!this.state.readonly &&
                                        <span index={attributeId} onClick={(e) => this.removeAttribute(attributeId, e)}>X</span>
                                    }
                                  </div>
                                  {
                                      <div>{attributeValues.join(", ")}</div>
                                  }

                                </div>
                              </div>
                              {!this.state.readonly &&
                                  <div id={"attributes-" + attributeId + "-form"} className="inplace-form" style={{display: 'none'}}>
                                    <form>
                                      <div index={attributeId}>
                                        {this.getAttributeName(attributeId)}
                                        <CreatableSelect value={(attributeValues || []).map(function(val){return {value: val, label: val}})}
                                          isMulti
                                          isClearable
                                          onChange={(e) => this.editAttributeValues(attributeId, e)}
                                          options={this.getAttributeValues(attributeId).map(function(val){return {value: val, label: val}})}
                                         />
                                      </div>
                                      <button type="button" className="btn btn-outline-secondary" onClick={(e) => this.cancelEditAttributeValues(e, attributeId)}>Cancel</button>
                                      <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("attributes", e, attributeId)}>Save</button>
                                    </form>
                                  </div>
                              }
                          </div>
                        )
                        } else {
                          return (
                            <div className="row">
                                <div id={"attributes-" + attributeId + "-form"} className="inplace-form col-sm-12">
                                    <div index={attributeId}>
                                        <CreatableSelect
                                            onChange={(e) => this.editAttributeKey(attributeId, e)}
                                            options={(this.state.projectAttributes || []).map(function(attribute){return {value: attribute.id, label: attribute.name}})}
                                        />
                                    </div>
                                    <button type="button" className="btn btn-outline-secondary" onClick={(e) => this.cancelEditAttributeKey(e, attributeId)}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("attributes", e, attributeId)}>Save</button>
                                </div>
                            </div>
                        )}

                    }.bind(this))
                  }
                  {!this.state.readonly &&
                      <div className="row">
                        <button type="button" className="btn btn-primary" onClick={(e) => this.addAttribute(e)}>
                           Add
                        </button>
                      </div>
                  }
              </div>
            </div>
        );

      }

}

export default TestCase;
