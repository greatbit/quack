import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import axios from "axios";
import AsyncSelect from 'react-select/lib/Async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import { withRouter } from 'react-router';
import $ from 'jquery';
import * as Utils from '../common/Utils';

class ProjectSettings extends SubComponent {

    constructor(props) {
        super(props);
        this.state = {
             project: {
                 id: null,
                 name: "",
                 description: "",
                 allowedGroups: [],
                 launcherConfigs: []
             },
             originalProject: {
                  id: null,
                  name: "",
                  description: "",
                  allowedGroups: []
              },
             groups: [],
             groupsToDisplay: [],
             launcherDescriptors: []
         };
         this.state.projectId = this.props.match.params.project;
         this.changeGroups = this.changeGroups.bind(this);
         this.submit = this.submit.bind(this);
         this.refreshGroupsToDisplay = this.refreshGroupsToDisplay.bind(this);
         this.getGroups = this.getGroups.bind(this);
         this.mapGroupsToView = this.mapGroupsToView.bind(this);
         this.toggleEdit = this.toggleEdit.bind(this);
         this.handleChange = this.handleChange.bind(this);
         this.removeProject = this.removeProject.bind(this);
         this.undelete = this.undelete.bind(this);
         this.getLauncherForm = this.getLauncherForm.bind(this);
         this.getDescriptor = this.getDescriptor.bind(this);
         this.addLauncher = this.addLauncher.bind(this);
      }

    componentDidMount() {
        super.componentDidMount();
        axios
          .get("/api/project/" + this.state.projectId)
          .then(response => {
            this.state.project = response.data;
            this.state.originalProject = this.state.project;
            this.refreshGroupsToDisplay();
            this.setState(this.state);
          }).catch(error => {Utils.onErrorMessage("Couldn't get project: ", error)});

          axios
            .get("/api/launcher/descriptors")
            .then(response => {
              this.state.launcherDescriptors = response.data;
              this.setState(this.state);
            }).catch(error => {Utils.onErrorMessage("Couldn't get launcher descriptors: ", error)});
     }

     getGroups(literal, callback){
        var url = "/api/user/groups/suggest";
        if (literal){
            url = url + "?literal=" + literal;
        }
        axios
           .get(url)
           .then(response => {
             this.state.groups = response.data;
             this.refreshGroupsToDisplay();
            callback(this.mapGroupsToView(this.state.groups));
           })
           .catch(error => console.log(error));
     }

    changeGroups(values){
        this.state.project.allowedGroups = values.map(function(value){return value.value});
        this.refreshGroupsToDisplay();
        this.setState(this.state);
    }

    submit(event, name){
        axios.put('/api/project', this.state.project)
            .then(response => {
                this.state.project = response.data;
                this.state.originalProject = this.state.project;
                this.toggleEdit(name);
                this.refreshGroupsToDisplay();
                this.setState(this.state);
                Utils.onSuccessMessage("Project Settings successfully saved");
        }).catch(error => {Utils.onErrorMessage("Couldn't save project: ", error)});
        event.preventDefault();
    }

    removeProject(event){
        axios.delete('/api/project/' + this.state.project.id)
            .then(response => {
                window.location.href = "/";
        }).catch(error => {Utils.onErrorMessage("Couldn't delete project: ", error)});
        event.preventDefault();

    }

    undelete(event){
        this.state.project.deleted = false;
        this.submit(event);
    }

    refreshGroupsToDisplay(){
        this.state.groupsToDisplay = this.mapGroupsToView(this.state.project.allowedGroups);
    }

    mapGroupsToView(groups){
        return groups.map(function(val){return {value: val, label: val}});
    }

    toggleEdit(fieldName, event){
        if(!fieldName) return;
        var fieldId = fieldName;
        if($("#" + fieldId + "-display").offsetParent !== null){
            this.state.originalProject[fieldName] = this.state.project[fieldName];
        }
        $("#" + fieldId + "-display").toggle();
        $("#" + fieldId + "-form").toggle();
        if (event){
            event.preventDefault();
        }
    }

    handleChange(fieldName, event){
        this.state.project[fieldName] = event.target.value;
        this.setState(this.state);
    }

    handleLauncherChange(event, index, propertyKey){
        this.state.project.launcherConfigs[index].properties[propertyKey] = event.target.value;
        this.setState(this.state);
    }

    cancelEdit(fieldName, event){
        this.state.project[fieldName] = this.state.originalProject[fieldName];
        this.setState(this.state);
        this.toggleEdit(fieldName, event);
    }

    getLauncherForm(config, index){
        var descriptor = this.getDescriptor(config.launcherId) || {};
        return (
            <p className="card-text">
                <form>
                    <select id="launcherId" index={index} onChange={(e) => this.handleLauncherChange(e, index, "launcherId")}>
                        <option> </option>
                        {
                            this.state.launcherDescriptors.map(function(descriptor){
                                var selected = descriptor.launcherId == config.launcherId;
                                if (selected){
                                    return (<option value={descriptor.launcherId} selected>{descriptor.name}</option>)
                                }
                                return (<option value={descriptor.launcherId}>{descriptor.name}</option>)

                            }.bind(this))
                        }
                    </select>
                    {
                        (descriptor.configDescriptors || []).map(function(descriptorItem){
                            return this.getLauncherPropertyTemplate(descriptorItem, config, index)
                        }.bind(this))

                    }
                </form>
            </p>
        )
    }

    getDescriptor(launcherId){
        return this.state.launcherDescriptors.find(descriptor => descriptor.launcherId == launcherId);
    }

    getLauncherPropertyTemplate(descriptorItem, config, index){
        //ToDo: use descriptor to render correct form
        return this.getLauncherPropertyTextTemplate(descriptorItem, config, index);
    }

    getLauncherPropertyTextTemplate(descriptorItem, config, index){
        return (
            <div className="form-group row">
                <label className="col-sm-2 col-form-label">{descriptorItem.name}</label>
                <div className="col-sm-10">
                    <input type="text" name={descriptorItem.key} value={config.properties[descriptorItem.key] || ""} index={index}  onChange={(e) => this.handleLauncherChange(e, index, descriptorItem.key)} />
                </div>
            </div>
        )
    }

    addLauncher(){
        this.state.project.launcherConfigs = this.state.project.launcherConfigs || [];
        this.state.project.launcherConfigs.push({
            properties: {}
        });
        this.setState(this.state);
    }

    render() {
        return (
            <div>
                <div id="name">
                    <div id="name-display" className="inplace-display">
                        {this.state.project.deleted &&
                            <h1>
                                <s>{this.state.project.name}</s> - DELETED
                                <button type="button" className="btn" onClick={this.undelete}>Undelete</button>
                            </h1>
                        }
                        {!this.state.project.deleted &&
                            <h1>
                                {this.state.project.name}
                                <span className="edit edit-icon clickable" onClick={(e) => this.toggleEdit("name", e)}><FontAwesomeIcon icon={faPencilAlt}/></span>
                            </h1>
                        }
                    </div>
                    <div id="name-form" className="inplace-form" style={{display: 'none'}}>
                        <form>
                            <div className="form-group row">
                                <div className="col-8">
                                    <input type="text" name="name" className="form-control" onChange={(e) => this.handleChange("name", e)} value={this.state.project.name}/>
                                </div>
                                <div className="col-4">
                                    <button type="button" className="btn btn-light" data-dismiss="modal" onClick={(e) => this.cancelEdit("name", e)}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={(e) => this.submit(e, "name")}>Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <h3>Permissions</h3>
                 <div className="row">
                    <div className="col-1">Groups</div>
                    <div className="col-6">
                        <AsyncSelect value={this.state.groupsToDisplay}
                                isMulti
                                cacheOptions
                                loadOptions={this.getGroups}
                                onChange={this.changeGroups}
                                options={this.mapGroupsToView(this.state.groups)}
                               />
                    </div>
                </div>

                <h3>Launchers</h3>
                 <div className="row">
                    {
                        (this.state.project.launcherConfigs || []).map(function(config, i){
                            return(
                                <div className="card project-card">
                                  <div className="card-header">
                                    <span>
                                        {config.name}
                                    </span>
                                    <span className='float-right clickable edit-icon red'>
                                        <FontAwesomeIcon icon={faMinusCircle} index={i}/>
                                    </span>
                                  </div>
                                  <div className="card-body">
                                    {
                                        this.getLauncherForm(config, i)
                                    }
                                  </div>
                                </div>
                            )
                        }.bind(this))
                    }
                </div>
                <div className="row">
                  <button type="button" className="btn btn-primary" onClick={this.addLauncher}>
                     Add Launcher
                  </button>
                </div>

                <button type="button" className="btn btn-primary" onClick={this.submit}>Save</button>
                <button type="button" className="btn btn-danger float-right" data-toggle="modal" data-target="#remove-project-confirmation">Remove Project</button>
                <div className="modal fade" tabIndex="-1" role="dialog" id="remove-project-confirmation">
                  <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Remove Project</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">Are you sure you want to remove Project?</div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" data-dismiss="modal" aria-label="Cancel">Close</button>
                          {!this.state.project.deleted &&
                            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.removeProject}>Remove Project</button>
                          }
                        </div>
                      </div>
                   </div>
               </div>
            </div>
        );
      }

}

export default ProjectSettings;
