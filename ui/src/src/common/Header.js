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
      <div>
        <nav class="site-navbar navbar navbar-default navbar-fixed-top navbar-mega" role="navigation">
          <div class="navbar-header">
              <button type="button" class="navbar-toggler hamburger hamburger-close navbar-toggler-left hided"
              data-toggle="menubar">
                <span class="sr-only">Toggle navigation</span>
                <span class="hamburger-bar"></span>
              </button>
              <button type="button" class="navbar-toggler collapsed" data-target="#site-navbar-collapse"
                data-toggle="collapse">
                <i class="icon md-more" aria-hidden="true"></i>
              </button>
              <div class="navbar-brand navbar-brand-center site-gridmenu-toggle" data-toggle="gridmenu">
                <Link to="/">
                  <img className="navbar-brand-logo" src="/images/smalllogoquack.png" />
                </Link>
                <span class="navbar-brand-text hidden-xs-down"> QuAck</span>
              </div>
              <button type="button" class="navbar-toggler collapsed" data-target="#site-navbar-search"
                data-toggle="collapse">
                <span class="sr-only">Toggle Search</span>
                <i class="icon md-search" aria-hidden="true"></i>
              </button>
          </div>


          <div className="site-gridmenu">
            <div>
              <div>
                <ul>
                  <li>
                    <a href="apps/mailbox/mailbox.html">
                      <i className="icon md-email"></i>
                      <span>Mailbox</span>
                    </a>
                  </li>
                  <li>
                    <a href="apps/calendar/calendar.html">
                      <i className="icon md-calendar"></i>
                      <span>Calendar</span>
                    </a>
                  </li>
                  <li>
                    <a href="apps/contacts/contacts.html">
                      <i className="icon md-account"></i>
                      <span>Contacts</span>
                    </a>
                  </li>
                  <li>
                    <a href="apps/media/overview.html">
                      <i className="icon md-videocam"></i>
                      <span>Media</span>
                    </a>
                  </li>
                  <li>
                    <a href="apps/documents/categories.html">
                      <i className="icon md-receipt"></i>
                      <span>Documents</span>
                    </a>
                  </li>
                  <li>
                    <a href="apps/projects/projects.html">
                      <i className="icon md-image"></i>
                      <span>Project</span>
                    </a>
                  </li>
                  <li>
                    <a href="apps/forum/forum.html">
                      <i className="icon md-comments"></i>
                      <span>Forum</span>
                    </a>
                  </li>
                  <li>
                    <a href="index.html">
                      <i className="icon md-view-dashboard"></i>
                      <span>Dashboard</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

      {/* Google analytics*/}
      { this.state.session.metainfo && this.state.session.metainfo.analyticsEnabled && (
            <Helmet>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-4CEVX7JVR7"></script>
            </Helmet>
        )}

        <Helmet>
          <script src="/assets/js/breakpoints.min.js"></script>
          {/*<script>*/}
          {/*  Breakpoints();*/}
          {/*</script>*/}

          <script src="/assets/js/Global/Component.js"></script>
          <script src="/assets/js/Global/Plugin.js"></script>
          <script src="/assets/js/Global/Base.js"></script>
          <script src="/assets/js/Global/Config.js"></script>

          <script src="/assets/js/Section/Menubar.js"></script>
          <script src="/assets/js/Section/Sidebar.js"></script>
          <script src="/assets/js/Section/PageAside.js"></script>
          <script src="/assets/js/Section/GridMenu.js"></script>

          <script src="/assets/js/config/colors.js"></script>
          <script src="/assets/js/config/tour.js"></script>
          {/*<script>Config.set('assets', '../assets');</script>*/}

          <script src="/assets/js/Site.js"></script>

          <script src="/assets/js/Plugin/asscrollable.js"></script>
          <script src="/assets/js/Plugin/slidepanel.js"></script>
          <script src="/assets/js/Plugin/switchery.js"></script>
          <script src="/assets/js/Plugin/matchheight.js"></script>
          <script src="/assets/js/Plugin/jvectormap.js"></script>
          <script src="/assets/js/Plugin/peity.js"></script>

          <script src="/assets/js/v1.js"></script>
        </Helmet>


        { this.state.session.metainfo && this.state.session.metainfo.analyticsEnabled && (
            <Helmet
              script={[{
                type: 'text/javascript',
                innerHTML: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-4CEVX7JVR7');"
              }]}
            />
        )}

      <div class="navbar-container container-fluid">

        <div class="collapse navbar-collapse navbar-collapse-toolbar" id="site-navbar-collapse">

          <ul class="nav navbar-toolbar">
            <li class="nav-item hidden-float" id="toggleMenubar">
              <a class="nav-link" data-toggle="menubar" href="#" role="button">
                <i class="icon hamburger hamburger-arrow-left">
                  <span class="sr-only">Toggle menubar</span>
                  <span class="hamburger-bar"></span>
                </i>
              </a>
            </li>
            <li class="nav-item hidden-sm-down" id="toggleFullscreen">
              <a class="nav-link icon icon-fullscreen" data-toggle="fullscreen" href="#" role="button">
                <span class="sr-only">Toggle fullscreen</span>
              </a>
            </li>
            <li class="nav-item hidden-float">
              <a class="nav-link icon md-search" data-toggle="collapse" href="#" data-target="#site-navbar-search"
                role="button">
                <span class="sr-only">Toggle Search</span>
              </a>
            </li>
            <li class="nav-item dropdown dropdown-fw dropdown-mega">
              <a class="nav-link" data-toggle="dropdown" href="#" aria-expanded="false" data-animation="fade"
                role="button">{this.state.projectName || "Projects"} <i class="icon md-chevron-down" aria-hidden="true"></i></a>
              <div class="dropdown-menu" role="menu">
                <div class="mega-content">
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
              </div>
            </li>
          </ul>

          <ul class="nav navbar-toolbar navbar-right navbar-toolbar-right">
            <li class="nav-item dropdown">
              <a class="nav-link navbar-avatar" data-toggle="dropdown" href="#" aria-expanded="false"
                data-animation="scale-up" role="button">
                <span class="avatar avatar-online">
                  <img src="/images/isericon.png" alt="..." />
                  <i></i>
                </span>
              </a>
              <div class="dropdown-menu" role="menu">
                {profileContext}
              </div>
            </li>
          </ul>
        </div>

        <div class="collapse navbar-search-overlap" id="site-navbar-search">
          <form role="search">
            <div class="form-group">
              <div class="input-search">
                <i class="input-search-icon md-search" aria-hidden="true"></i>
                <input type="text" class="form-control" name="site-search" placeholder="Search..." />
                <button type="button" class="input-search-close icon md-close" data-target="#site-navbar-search"
                  data-toggle="collapse" aria-label="Close"></button>
              </div>
            </div>
          </form>
        </div>
      </div>
      </nav>
      <div class="site-menubar">
        <ul className="site-menu">
          {this.props.project && (
            <span>
            <li className="site-menu-item">
              <Link className="nav-link" to={"/" + this.props.project + "/testcases"}>
                <i class="site-menu-icon md-case-check" aria-hidden="true"></i>
                <span class="site-menu-title">TestCases</span>
              </Link>
            </li>
            <li className="site-menu-item">
              <Link className="nav-link" to={"/" + this.props.project + "/launches"}>
                <i class="site-menu-icon md-case-play" aria-hidden="true"></i>
                <span class="site-menu-title">Launches</span>
              </Link>
            </li>
            <li className="site-menu-item">
              <Link className="nav-link" to={"/" + this.props.project + "/testsuites"}>
                <i class="site-menu-icon md-collection-text" aria-hidden="true"></i>
                <span class="site-menu-title">Suites</span>
              </Link>
            </li>
            <li className="site-menu-item">
              <Link className="nav-link" to={"/" + this.props.project + "/attributes"}>
                <i class="site-menu-icon md-format-list-bulleted" aria-hidden="true"></i>
                <span class="site-menu-title">Attributes</span>
              </Link>
            </li>
            </span>
          )}
        </ul>
      </div>
    </div>
    );
  }
}

export default withRouter(Header);
