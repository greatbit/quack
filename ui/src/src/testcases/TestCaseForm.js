import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';

class TestCaseForm extends SubComponent {
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
             projectAttributes: []
         };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addAttribute = this.addAttribute.bind(this);
        this.getAttribute = this.getAttribute.bind(this);
        this.getAttributeName = this.getAttributeName.bind(this);
        this.getAttributeValues = this.getAttributeValues.bind(this);
        this.editAttributeKey = this.editAttributeKey.bind(this);
      }

      handleChange(event) {
        var testcaseUpd = this.state.testcase;
        testcaseUpd[event.target.name] = event.target.value;
        const newState = Object.assign({}, this.state, {
          testcase: testcaseUpd
        });
        this.setState(newState);
      }

      handleSubmit(event) {
        axios.post('/api/' + this.props.match.params.project + '/testcase/', this.state.testcase)
        .then(response => {
            this.props.history.push("/" + this.props.match.params.project + '/testcases/' + response.data.id);
        })
        event.preventDefault();
      }

    componentWillReceiveProps(nextProps) {
      if(nextProps.testcase){
        this.state.testcase = nextProps.testcase;
      }
      if (nextProps.projectAttributes){
        this.state.projectAttributes = nextProps.projectAttributes;
      }
      this.setState(this.state);
    }

    addAttribute(){
        this.state.testcase.attributes.push({
            id: null
        });
        this.setState(this.state);
    }

    editAttributeKey(index, event){
        this.state.testcase.attributes[index].id = event.target.value;
        this.setState(this.state);
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

    componentDidMount() {
        super.componentDidMount();
        this.state.projectAttributes = this.props.projectAttributes || [];
        if (this.props.id){
            axios
              .get("/api/"  + this.props.match.params.project + "/testcase/"+ this.props.id)
              .then(response => {
                this.state.testcase = response.data;
              })
              .catch(error => console.log(error));
        }
        this.setState(this.state);
     }


    render() {
        return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="editAttributeLabel">Attribute</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <label>
                        Name:
                        <input type="text" name="name" value={this.state.testcase.name} onChange={this.handleChange} />
                      </label>
                      <label>
                        Description:
                        <input type="text" name="description" value={this.state.testcase.description} onChange={this.handleChange} />
                      </label>

                      {
                      (this.state.testcase.attributes || []).map(function(attribute, i){
                              if(attribute.id){
                               return (
                                  <div index={i}>
                                    {this.getAttributeName(attribute.id)}
                                      <select value={attribute.values}>
                                        {this.getAttributeValues(attribute.id)
                                            .map(function(value){
                                                return <option value={value}>{value}</option>
                                            })
                                        }
                                      </select>
                                  </div>

                               );
                              } else {
                                return (
                                  <div index={i}>
                                    <select value={attribute.id} onChange={(e) => this.editAttributeKey(i, e)}>
                                        {(this.state.projectAttributes || []).map(function(projectAttribute){
                                            return <option value={projectAttribute.id}>{projectAttribute.name}</option>
                                        })}
                                    </select>
                                  </div>

                              );

                              }
                          }.bind(this))
                      }
                      <button type="button" className="btn btn-secondary" id="addAttribute" onClick={this.addAttribute}>Add attribute</button>
                    </form>

                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Save changes</button>
                  </div>
                </div>
             </div>
        );
      }


}

export default withRouter(TestCaseForm);
