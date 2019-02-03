import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import AttributeForm from '../attributes/AttributeForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import $ from 'jquery';

class Attributes extends SubComponent {
    constructor(props) {
        super(props);
        this.state = {
             attributes: [],
             attributeToEdit: {
                 id: null,
                 name: "",
                 values: []
             }
         }
        this.onAttributeAdded = this.onAttributeAdded.bind(this);
    }

    onAttributeAdded(attribute){
        var attributeToUpdate = this.state.attributes.find(function(attr){attr.id === attribute.id});
        if (!attributeToUpdate){
            this.state.attributes.push(attribute);
        } else {
            this.state.attributes[this.state.attributes.indexOf(attributeToUpdate)] = attribute;
        }
        this.state.attributeToEdit = {
            id: null,
            name: "",
            values: []
        }
        $("#editAttribute").modal('hide');
        const newState = Object.assign({}, this.state);
        this.setState(newState);
    }

    editAttribute(i, event){
        this.state.attributeToEdit = this.state.attributes[i];
        this.setState(this.state);
        $("#editAttribute").modal('show');
    }

    componentDidMount() {
        super.componentDidMount();
        axios
          .get("/api/" + this.props.match.params.project +  "/attribute")
          .then(response => {
            const newState = Object.assign({}, this.state, {
              attributes: response.data
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }


    render() {
        return (
          <div>
            {
                this.state.attributes.map(function(attribute, i){
                    return (

                        <div className="alert" role="alert">
                          <h5 className="alert-heading">
                            <b>{attribute.name}</b>
                            <span className="glyphicon glyphicon-pencil edit clickable edit-icon" index={i} onClick={(e) => this.editAttribute(i, e)}>
                                <FontAwesomeIcon icon={faEdit}/>
                            </span>
                          </h5>
                          <p>{attribute.description}</p>
                          <hr/>
                          <p class="mb-0">{attribute.values.join(", ")}</p>
                        </div>

                    );
                }.bind(this))
            }

            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editAttribute">
              Add
            </button>
            <div className="modal fade" id="editAttribute" tabindex="-1" role="dialog" aria-labelledby="editAttributeLabel" aria-hidden="true">
                <AttributeForm project={this.props.match.params.project}
                                attribute={this.state.attributeToEdit}
                                onAttributeAdded={this.onAttributeAdded}/>
            </div>
          </div>

        );
    }

}

export default Attributes;
