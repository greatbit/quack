import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

class Projects extends Component {
    state = {
        projects: []
    };

    componentDidMount() {
        axios
          .get("/api/project")
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
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }


    render() {
        return (
          <div className='col-12'>
            {
                this.state.projects.map(function(project){
                    return (
                        <div className="card">
                          <div className="card-header">
                            <Link to={'/projects/' + project.id}>{project.name}</Link>
                          </div>
                          <div className="card-body">
                            <p className="card-text">{project.description || ''}</p>
                          </div>
                        </div>
                    )
                })
            }
          </div>
        );
      }

}

export default Projects;
