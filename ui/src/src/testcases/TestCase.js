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
        (this.state.testcase.attributes || []).forEach(function(attribute, index){
            if (attribute.id && (
                    attribute.values === undefined || attribute.values === null || attribute.values.length == 0)
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
            newState.testcase.attributes = newState.testcase.attributes.filter(function(attribute){
                return attribute.values !== undefined && attribute.values !== null && attribute.values.length > 0
                })
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
                    console.log("toggle");
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

    cancelEditAttributeKey(event, index){
        if (this.state.testcase.attributes[index].id === undefined ||
           this.state.testcase.attributes[index].values === undefined ||
           this.state.testcase.attributes[index].values.length == 0)
        this.state.testcase.attributes.splice(index, 1);
        this.setState(this.state);
    }

    removeAttribute(i, event){
        this.state.testcase.attributes.splice(i, 1);
        this.setState(this.state);
    }

    addAttribute(){
        if (!this.state.testcase.attributes){
            this.state.testcase.attributes = [];
        }
        this.state.testcase.attributes.push({});
        this.setState(this.state);
    }

    editAttributeKey(index, data){
        this.state.testcase.attributes[index].id = data.value;
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

    render() {
        return (
            <div>
              <div id="name" className="testcase-section">
                <div id="name-display" className="inplace-display">
                    <h1>{this.state.testcase.name}
                        {!this.state.readonly &&
                            <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("name", e)}><FontAwesomeIcon icon={faEdit}/></span>
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
                        <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("description", e)}><FontAwesomeIcon icon={faEdit}/></span>
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
                        <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("preconditions", e)}><FontAwesomeIcon icon={faEdit}/></span>
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
                                <form>
                                    <div id={"steps-" + i + "-form"} className="inplace-form">
                                        <div index={i}>
                                            <input type="text" name="step.action" onChange={(e) => this.handleStepActionChange(i, e)} />
                                            <input type="text" name="step.expectation" onChange={(e) => this.handleStepExpectationChange(i, e)} />
                                        </div>
                                        <button type="button" className="btn btn-secondary" onClick={(e) => this.cancelEdit("steps", e, i)}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("steps", e, i, true)}>Save</button>
                                    </div>
                                </form>
                            </div>
                          )
                          } else {
                            return (
                              <div className="row">
                                  <div id={"steps-" + i + "-display"} className="inplace-display">
                                      <div index={i} className="row">
                                         <div className="col">{i + 1}. </div>
                                         <div className="col">{this.state.testcase.steps[i].action}</div>
                                         <div className="col">{this.state.testcase.steps[i].expectation}</div>
                                         {!this.state.readonly &&
                                            <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("steps", e, i)}><FontAwesomeIcon icon={faEdit}/></span>
                                         }
                                      </div>
                                  </div>
                                  {!this.state.readonly &&
                                      <div id={"steps-" + i + "-form"} className="inplace-form"style={{display: 'none'}}>
                                          <div index={i}>
                                              <input type="text" name="step.action" onChange={(e) => this.handleStepActionChange(i, e, true)} value={this.state.testcase.steps[i].action}/>
                                              <input type="text" name="step.expectation" onChange={(e) => this.handleStepExpectationChange(i, e, true)} value={this.state.testcase.steps[i].expectation}/>
                                          </div>
                                          <button type="button" className="btn btn-secondary" onClick={(e) => this.cancelEdit("steps", e, i)}>Cancel</button>
                                          <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("steps", e, i)}>Save</button>
                                      </div>
                                  }
                              </div>
                          )}

                      }.bind(this))
                    }
                    {!this.state.readonly &&
                        <div>
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
                  (this.state.testcase.attributes || []).map(function(attribute, i){
                      if(attribute.id){
                        return (
                          <div className="row">
                              <div id={"attributes-" + i + "-display"} className="inplace-display">
                                <div index={i}>
                                  {this.getAttributeName(attribute.id)}
                                  {!this.state.readonly &&
                                      <span className="glyphicon glyphicon-pencil edit clickable" onClick={(e) => this.toggleEdit("attributes", e, i)}><FontAwesomeIcon icon={faEdit}/></span>
                                  }
                                  {!this.state.readonly &&
                                      <span index={i} onClick={(e) => this.removeAttribute(i, e)}>X</span>
                                  }
                                </div>
                              </div>
                              {!this.state.readonly &&
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
                              }
                          </div>
                        )
                        } else {
                          return (
                            <div className="row">
                                <form>
                                    <div id={"attributes-" + i + "-form"} className="inplace-form">
                                        <div index={i}>
                                            <CreatableSelect
                                                onChange={(e) => this.editAttributeKey(i, e)}
                                                options={(this.state.projectAttributes || []).map(function(attribute){return {value: attribute.id, label: attribute.name}})}
                                            />
                                        </div>
                                        <button type="button" className="btn btn-secondary" onClick={(e) => this.cancelEditAttributeKey(e, i)}>Cancel</button>
                                        <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit("attributes", e, i)}>Save</button>
                                    </div>
                                </form>

                            </div>
                        )}

                    }.bind(this))
                  }
                  {!this.state.readonly &&
                      <div>
                        <button type="button" className="btn btn-primary" onClick={this.addAttribute}>
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
