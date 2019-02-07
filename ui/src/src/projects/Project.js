import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import TestSuitesWidget from '../testsuites/TestSuitesWidget'
import LaunchesWidget from '../launches/LaunchesWidget'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'

class Project extends SubComponent {

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
      }

    componentDidMount() {
        super.componentDidMount();
        axios
          .get("/api/project/" + this.props.match.params.project)
          .then(response => {
            const newState = Object.assign({}, this.state, {
              project: response.data
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }


    render() {
        return (
            <div>
                <h1>
                    {this.state.project.name}
                    <span className='float-right'>
                        <Link to={'/projects/' + this.state.project.id + '/settings'}>
                            <FontAwesomeIcon icon={faCogs}/>
                        </Link>
                    </span>
                </h1>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="card project-card">
                          <div className="card-header">
                            <span>
                                <Link to={'/' + this.state.project.id + '/testsuites'}>Test Suites</Link>
                            </span>
                          </div>
                          <div className="card-body">
                            <TestSuitesWidget limit={11} projectId={this.props.match.params.project}/>
                          </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="card project-card">
                          <div className="card-header">
                            <span>
                                <Link to={'/' + this.state.project.id + '/launches'}>Launches</Link>
                            </span>
                          </div>
                          <div className="card-body">
                            <LaunchesWidget limit={5} projectId={this.props.match.params.project}/>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        );
      }

}

export default Project;
