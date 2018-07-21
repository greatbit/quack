import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

class Projects extends Component {
    state = {
        projects: []
    };

    componentDidMount() {
        axios
          .get("/api/projects")
          .then(response => {

            const projects = response.data.map(project => {
              return {
                id: project.id,
                name: project.name
              };
            });

            const newState = Object.assign({}, this.state, {
              projects: projects
            });

            // store the new state object in the component's state
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }


    render() {
        return (
          <div>
            <ul>{
                this.state.projects.map(function(project){
                    return <li><Link to="/projects/{project.id}">{project.name}</Link></li>;
                })
            }</ul>
          </div>
        );
      }

}

export default Projects;
