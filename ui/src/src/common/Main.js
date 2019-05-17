import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import TestCases from '../testcases/TestCases'
import TestSuites from '../testsuites/TestSuites'
import Projects from '../projects/Projects'
import ProjectForm from '../projects/ProjectForm'
import Project from '../projects/Project'
import ProjectSettings from '../projects/ProjectSettings'
import Launches from '../launches/Launches'
import Launch from '../launches/Launch'
import LaunchesStatistics from '../launches/LaunchesStatistics'
import Attributes from '../attributes/Attributes'
import TestCaseForm from '../testcases/TestCaseForm'
import TestCase from '../testcases/TestCase'
import Auth from '../user/Auth'
import Login from '../user/Login'

class Main extends Component {

    onProjectChange(project){
        this.props.onProjectChange(project)
    }

    onSessionChange(session){
        this.props.onSessionChange(session)
    }

    render() {
        return(
            <main>

                <div className="row justify-content-end">
                    <div className="alert alert-success alert-message col-4" id="success-alert">
                        <span id="success-message-text"></span>
                    </div>
                    <div className="alert alert-danger alert-message col-4" id="error-alert" >
                        <span id="error-message-text"></span>
                    </div>
                </div>

                <Switch>
                  <Route exact path='/' component={Projects}/>
                  <Route exact path='/projects' component={Projects}/>
                  <Route exact path='/projects/new' component={ProjectForm}/>

                  <Route exact path='/auth' component={Auth}/>
                  <Route path='/login'
                      render={(props) => <Login {...props}  onProjectChange={this.onProjectChange.bind(this)}
                      onSessionChange={this.onSessionChange.bind(this)} /> }/>

                  <Route path='/:project/testcases/new'
                      render={(props) => <TestCaseForm {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route exact path='/projects/:project'
                      render={(props) => <Project {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route exact path='/projects/:project/settings'
                      render={(props) => <ProjectSettings {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route path='/:project/testcase/:testcase'
                      render={(props) => <TestCase {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route path='/:project/testcases'
                      render={(props) => <TestCases {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route path='/:project/testsuites'
                      render={(props) => <TestSuites {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route exact path='/:project/launches/'
                      render={(props) => <Launches {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route exact path='/:project/launches/statistics/'
                       render={(props) => <LaunchesStatistics {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route path='/:project/launch/:launchId'
                      render={(props) => <Launch {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route path='/:project/launch/:launchId/:testcaseUuid'
                      render={(props) => <Launch {...props}  onProjectChange={this.onProjectChange.bind(this)} /> }/>
                  <Route path='/:project/attributes'
                      render={(props) => <Attributes {...props} onProjectChange={this.onProjectChange.bind(this)} /> }/>

                </Switch>
            </main>
        );
    }
}

export default Main;
