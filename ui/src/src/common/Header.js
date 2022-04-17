/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import * as UserSession from "../user/UserSession";
import * as Utils from "../common/Utils";
import Backend from "../services/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import {Helmet} from "react-helmet";

class Header extends Component {
  constructor(props) {
    super(props);
    this.emptyState = {
        session: {
            person: { firstName: "Guest"},
            metainfo: {analyticsEnabled: false}
        }
    };
    this.state = Object.assign({}, { session: this.props.session, projects: [] });
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    Backend.get("user/session")
      .then(response => {
        if (this.state.session.id !== response.id) {
          this.state.session = response;
          this.setState(this.state);
          this.onSessionChange(this.state.session);
          if (
            this.state.session.person.defaultPassword &&
            !window.location.pathname.includes("/user/change-password-redirect") &&
            !window.location.pathname.includes("/user/changepass")
          ) {
            this.props.history.push("/user/change-password-redirect/" + this.state.session.person.login);
          } else if (
            this.state.session.metainfo.organizationsEnabled &&
            !this.state.session.metainfo.currentOrganization &&
            window.location.pathname != "/orgselect" &&
            window.location.pathname != "/organizations/new"
          ) {
            this.props.history.push("/orgselect");
          }
        }
      })
      .catch(() => {
        console.log("Unable to fetch session");
      });
    Backend.get("project?includedFields=name,description,id,readWriteGroups,readWriteUsers")
      .then(response => {
        this.state.projects = response;
        this.setState(this.state);
      })
      .catch(() => {});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.session && this.state.session != nextProps.session.id) {
      this.state.session = nextProps.session;
      this.setState(this.state);
    }
    if (nextProps.project && this.state.projectId != nextProps.project) {
      this.state.projectId = nextProps.project;
      this.getProject();
    }
  }

  onSessionChange(session) {
    if (session && session.person) {
      UserSession.getSession().login = session.person.id;
      UserSession.getSession().name = session.person.name;
      UserSession.getSession().isAdmin = session.isAdmin;
      UserSession.getSession().roles = session.person.roles;
      UserSession.getSession().groups = session.person.groups;
      UserSession.getSession().permissions = session.person.permissions;
    }
    this.props.onSessionChange(session);
  }

  changeOrganization(organizationId){
      Backend.post("user/changeorg/" + organizationId)
        .then(response => {
          this.onSessionChange(response);
          window.location = "/";
        })
        .catch(error => {
          console.log("Unable to change organization");
        });
  }

  getProject() {
    Backend.get("project/" + this.state.projectId).then(response => {
      this.state.projectName = response.name;
      this.state.projectId = response.id;
      this.setState(this.state);
    });
  }

  logOut() {
    Backend.delete("user/logout")
      .then(() => {
        const newState = Object.assign({}, this.emptyState);
        this.setState(newState);
        this.onSessionChange(this.state.session);
        this.props.history.push("/auth");
      })
      .catch(error => console.log(error));
  }

  renderProjects() {
    return (
      <ul className="navbar-nav">
        <li className="nav-item dropdown">
          <a
            className="nav-item nav-link dropdown-toggle mr-md-2"
            href="#"
            id="bd-projects"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.state.projectName || "Projects"}
          </a>
          <div className="dropdown-menu dropdown-menu-left" aria-labelledby="bd-projects">
            <Link className="dropdown-item " to="/projects">
              All
            </Link>
            {this.state.projects.map(function (project) {
              return (
                <Link to={"/projects/" + project.id} key={project.id} className="dropdown-item">
                  {project.name}
                </Link>
              );
            })}
            {Utils.isUserOwnerOrAdmin(this.state.session) && (
              <div>
                <hr />
                <Link to={"/projects/new"} className="dropdown-item">
                  Create Project
                </Link>
              </div>
            )}
          </div>
        </li>
      </ul>
    );
  }

  render() {
    let profileContext;
    if (this.state.session.id) {
      profileContext = (
        <span>
        {!this.state.session.metainfo || !this.state.session.metainfo.organizationsEnabled && (
          <div>
            <a className="dropdown-item" href={"/user/profile/" + this.state.session.person.login}>
                Profile
            </a>
          </div>
         )}

          {this.state.session.metainfo && this.state.session.metainfo.organizationsEnabled && (
            <div>
                {this.state.session.metainfo.organizations.map(function (organization, index) {
                  return (
                    <div index={index}  className='clickable dropdown-item' onClick={e => this.changeOrganization(organization.id, e)}>
                        {organization.name}
                        {this.state.session.metainfo.currentOrganization === organization.id && (<span> <FontAwesomeIcon icon={faCheck} /></span>)}
                    </div>
                  )
                }.bind(this))}
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item " to="/organizations/edit">
                    Edit Current Organization
                </Link>
                <Link className="dropdown-item " to="/organizations/new">
                    Create New Organization
                </Link>

            </div>
          )}

          {Utils.isUserOwnerOrAdmin(this.state.session) && (!this.state.session.metainfo || !this.state.session.metainfo.organizationsEnabled) && (
            <div>
              <div className="dropdown-divider"></div>
              <a className="dropdown-item" href={"/user/all-users-redirect"}>
                All Users
              </a>
              <a className="dropdown-item" href={"/user/create-redirect"}>
                Create User
              </a>
            </div>
          )}

          <div className="dropdown-divider"></div>
          <a className="dropdown-item" href="#" onClick={this.logOut}>
            Log out
          </a>
        </span>
      );
    } else {
      profileContext = (
        <a className="dropdown-item active" href="/auth">
          Login
        </a>
      );
    }
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-green">

      {/* Google analytics*/}
      { this.state.session.metainfo && this.state.session.metainfo.analyticsEnabled && (
            <Helmet>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-4CEVX7JVR7"></script>
            </Helmet>
        )}
        { this.state.session.metainfo && this.state.session.metainfo.analyticsEnabled && (
            <Helmet
              script={[{
                type: 'text/javascript',
                innerHTML: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-4CEVX7JVR7');"
              }]}
            />
        )}

        <Link className="navbar-brand" to="/">
          <img src="/images/smalllogoquack.png" />
        </Link>
        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {this.renderProjects()}
          {!this.props.project && <ul className="navbar-nav mr-auto"></ul>}
          {this.props.project && (
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/" + this.props.project + "/testcases"}>
                  TestCases
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/" + this.props.project + "/launches"}>
                  Launches
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/" + this.props.project + "/testsuites"}>
                  Suites
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/" + this.props.project + "/attributes"}>
                  Attributes
                </Link>
              </li>
            </ul>
          )}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-item nav-link dropdown-toggle mr-md-2"
                href="#"
                id="bd-login"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.session.person.firstName || ""} {this.state.session.person.lastName || ""}
              </a>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="bd-login">
                {profileContext}
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(Header);
