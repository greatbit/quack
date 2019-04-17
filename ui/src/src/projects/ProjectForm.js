import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import * as Utils from '../common/Utils';


class ProjectForm extends Component {


    constructor(props) {
        super(props);
        this.state = {
             project: {
                 id: null,
                 name: "",
                 description: "",
                 allowedGroups: []
             }
         };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) {
        var projectUpd = this.state.project;
        projectUpd[event.target.name] = event.target.value;
        const newState = Object.assign({}, this.state, {
          project: projectUpd
        });
        this.setState(newState);
      }

      handleSubmit(event) {
        axios.post('/api/project', this.state.project)
        .then(response => {
            this.props.history.push('/projects');
        }).catch(error => {Utils.onErrorMessage("Couldn't save project: " + error.message)});
        event.preventDefault();
      }

    componentDidMount() {
        if (this.props.id){
            axios
              .get("/api/project/" + this.props.id)
              .then(response => {
                const newState = Object.assign({}, this.state, {
                  project: response.data
                });
                this.setState(newState);
              }).catch(error => {Utils.onErrorMessage("Couldn't get project: " + error.message)});
        }
     }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={this.state.project.name} onChange={this.handleChange} />
              </label>
              <label>
                Description:
                <input type="text" name="description" value={this.state.project.description} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
        );
      }

}

export default withRouter(ProjectForm);
