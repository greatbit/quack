import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

class Projects extends Component {
    state = {
        projects: []
    };

    componentDidMount() {
        axios
          .get("/api/project")
          .then(response => {
            const projects = response.data;
            const newState = Object.assign({}, this.state, {
              projects: projects
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }


    render() {
        return (
          <div className='container'>
            {
                this.state.projects.map(function(project){
                    return (
                        <div className="card project-card">
                          <div className="card-header">
                            <span>
                                <Link to={'/projects/' + project.id}>{project.name}</Link>
                            </span>
                            <span className='float-right'>
                                <Link to={'/projects/' + project.id + '/settings'}>
                                    <FontAwesomeIcon icon={faCogs}/>
                                </Link>
                            </span>
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
