import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import axios from "axios";
import AsyncSelect from 'react-select/lib/Async';
import { withRouter } from 'react-router';

class ProjectSettings extends SubComponent {

    constructor(props) {
        super(props);
        this.state = {
             project: {
                 id: null,
                 name: "",
                 description: "",
                 allowedGroups: []
             },
             groups: [],
             groupsToDisplay: []
         };
         this.state.projectId = this.props.match.params.project;
         this.changeGroups = this.changeGroups.bind(this);
         this.submit = this.submit.bind(this);
         this.refreshGroupsToDisplay = this.refreshGroupsToDisplay.bind(this);
         this.getGroups = this.getGroups.bind(this);
         this.mapGroupsToView = this.mapGroupsToView.bind(this);
      }

    componentDidMount() {
        super.componentDidMount();
        axios
          .get("/api/project/" + this.state.projectId)
          .then(response => {
            this.state.project = response.data;
            this.refreshGroupsToDisplay();
            this.setState(this.state);
          })
          .catch(error => console.log(error));
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

    submit(event){
        axios.put('/api/project', this.state.project)
            .then(response => {
                this.state.project = response.data;
                this.refreshGroupsToDisplay();
                this.setState(this.state);
        })
        event.preventDefault();
    }

    refreshGroupsToDisplay(){
        this.state.groupsToDisplay = this.mapGroupsToView(this.state.project.allowedGroups);
    }

    mapGroupsToView(groups){
        return groups.map(function(val){return {value: val, label: val}});
    }

    render() {
        return (
            <div>
                <h1>Name: {this.state.project.name}</h1>
                <h2>Settings</h2>
                 <div className="row">
                    <div className="col-1">Groups</div>
                    <div className="col-3">
                        <AsyncSelect value={this.state.groupsToDisplay}
                                isMulti
                                cacheOptions
                                loadOptions={this.getGroups}
                                onChange={this.changeGroups}
                                options={this.mapGroupsToView(this.state.groups)}
                               />
                    </div>
                </div>
                <div className="row">
                    <button type="button" className="btn btn-primary" onClick={this.submit}>Save</button>
                </div>
            </div>
        );
      }

}

export default ProjectSettings;
