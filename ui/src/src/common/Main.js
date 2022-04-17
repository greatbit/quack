import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import TestCases from "../testcases/TestCases";
import TestSuites from "../testsuites/TestSuites";
import Projects from "../projects/Projects";
import ProjectForm from "../projects/ProjectForm";
import Project from "../projects/Project";
import OrganizationForm from "../organizations/OrganizationForm";
import ProjectSettings from "../projects/ProjectSettings";
import Launches from "../launches/Launches";
import Launch from "../launches/Launch";
import LaunchesStatistics from "../launches/LaunchesStatistics";
import LaunchTestcasesHeatmap from "../launches/LaunchTestcasesHeatmap";
import Attributes from "../attributes/Attributes";
import TestCaseForm from "../testcases/TestCaseForm";
import TestCase from "../testcases/TestCase";
import Auth from "../user/Auth";
import IdpAuth from "../user/IdpAuth";
import Login from "../user/Login";
import Profile from "../user/Profile";
import ChangePassword from "../user/ChangePassword";
import Users from "../user/Users";
import CreateUser from "../user/CreateUser";
import OrgSelect from "../user/OrgSelect";
import Events from "../audit/Events";
import Redirect from "../common/Redirect";

class Main extends Component {
  onProjectChange(project) {
    this.props.onProjectChange(project);
  }

  onSessionChange(session) {
    this.props.onSessionChange(session);
  }

  render() {
    return (
      <main>
        <div className="row justify-content-end">
          <div className="alert alert-success alert-message col-4" id="success-alert">
            <span id="success-message-text"></span>
          </div>
          <div className="alert alert-danger alert-message col-4" id="error-alert">
            <span id="error-message-text"></span>
          </div>
        </div>

        <Switch>
          <Route exact path="/" component={Projects} />
          <Route exact path="/projects" component={Projects} />
          <Route exact path="/projects/new" component={ProjectForm} />

          <Route exact
            path="/orgselect"
            render={props =>(
                <OrgSelect {...props} onSessionChange={this.onSessionChange.bind(this)} />
                )}
          />
          <Route exact path="/organizations/new" component={OrganizationForm} />
          <Route
              exact
              path="/organizations/edit"
              render={props => <OrganizationForm {...props} editCurrent="true" />}
            />

          <Route exact path="/auth" component={Auth} />
          <Route
              path="/idpauth"
              render={props => (
                <IdpAuth {...props} onSessionChange={this.onSessionChange.bind(this)}/>
              )}
            />

          <Route
            exact
            path="/user/create-redirect"
            render={props => <Redirect {...props} requestUrl={"user/create-redirect"} />}
          />
          <Route
            exact
            path="/user/all-users-redirect"
            render={props => <Redirect {...props} requestUrl={"user/all-redirect"} />}
          />
          <Route
            exact
            path="/user/change-password-redirect/:login"
            render={props => <Redirect {...props} requestUrl={"user/change-password-redirect?login=" + props.match.params["login"] || ""} />}
          />

          <Route exact path="/user/create" component={CreateUser} />
          <Route
            exact
            path="/user/"
            render={props => <Users {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />

          <Route exact path="/user/profile/:profileId" component={Profile} />
          <Route exact path="/user/changepass/:profileId" component={ChangePassword} />

          <Route
            path="/login"
            render={props => (
              <Login
                {...props}
                onProjectChange={this.onProjectChange.bind(this)}
                onSessionChange={this.onSessionChange.bind(this)}
              />
            )}
          />
          <Route
            path="/:project/testcases/new"
            render={props => <TestCaseForm {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/projects/:project"
            render={props => <Project {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/projects/:project/settings"
            render={props => <ProjectSettings {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            path="/:project/testcase/:testcase"
            render={props => <TestCase {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/:project/testcases"
            render={props => <TestCases {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            path="/:project/testsuites"
            render={props => <TestSuites {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/:project/launches/"
            render={props => <Launches {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/:project/launches/statistics/"
            render={props => <LaunchesStatistics {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/:project/launches/heatmap/"
            render={props => <LaunchTestcasesHeatmap {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/:project/launch/:launchId"
            render={props => <Launch {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/:project/launch/:launchId/:testcaseUuid"
            render={props => <Launch {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            path="/:project/attributes"
            render={props => <Attributes {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
          <Route
            exact
            path="/:project/audit"
            render={props => <Events {...props} onProjectChange={this.onProjectChange.bind(this)} />}
          />
        </Switch>
      </main>
    );
  }
}

export default Main;
