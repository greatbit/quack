import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from "axios";

class Header extends Component {

    constructor(props) {
        super(props);
        this.emptyState = {session : {person: {firstName: "Guest"}}};
        this.state = Object.assign({}, {session: this.props.session, projects: []});
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        var that = this;
        axios
          .get("/api/user/session")
          .then(response => {
            if (this.state.session.id !== response.data.id){
                this.state.session = response.data;
                this.setState(this.state);
                this.onSessionChange(this.state.session);
            }
          })
          .catch(error => this.props.history.push("/auth"));
        axios
          .get("/api/project?includedFields=name,description,id")
          .then(response => {
              this.state.projects = response.data;
              this.setState(this.state);
          })

        axios
          .get("/api/project?includedFields=name,description,id")
          .then(response => {
              this.state.projects = response.data;
              this.setState(this.state);
          })
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.session){
        this.state.session = this.props.session;
      }
      if(nextProps.project){
        this.state.projectId = nextProps.project;
        this.getProject();
      }
      this.setState(this.state);
    }

    onSessionChange(session){
        this.props.onSessionChange(session)
    }

    getProject(){
        axios
          .get("/api/project/" + this.state.projectId)
          .then(response => {
              this.state.projectName = response.data.name;
              this.state.projectId = response.data.id;
              this.setState(this.state);
          })
    }

    logOut(){
        axios
          .delete("/api/user/logout")
          .then(response => {
            const newState = Object.assign({}, this.emptyState);
            this.setState(newState);
            this.onSessionChange(this.state.session);
            this.props.history.push("/auth");
          })
          .catch(error => console.log(error));
    }

    renderProjects(){
        return (
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-projects" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.projectName || 'Projects'}
                </a>
                <div className="dropdown-menu dropdown-menu-left" aria-labelledby="bd-projects">
                  <Link className="dropdown-item " to="/projects">All</Link>
                  {this.state.projects.map(function(project){
                      return (
                           <Link to={'/projects/' + project.id} className='dropdown-item'>{project.name}</Link>
                      )
                  })}
                </div>
              </li>
          </ul>
        )
    }


    render() {
        let profileContext;
        if (this.state.session.id){
            profileContext = (
            <span>
                <a className="dropdown-item" href="/user/profile">Profile</a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#" onClick={this.logOut}>Log out</a>
            </span>
            )
          } else {
            profileContext = <a className="dropdown-item active" href="/auth">Login</a>
        }
        return (
          <nav className="navbar navbar-expand-md navbar-dark bg-green">
            <Link className="navbar-brand" to="/">
                <img src='/images/smalllogoquack.png'/>
            </Link>
            <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            {this.renderProjects()}
            {!this.props.project &&
                <ul className="navbar-nav mr-auto"></ul>
            }
            {this.props.project &&
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item"><Link className="nav-link" to={"/" + this.props.project + "/attributes"}>Attributes</Link></li>
                    <li className="nav-item"><Link className="nav-link" to={"/" + this.props.project + "/testcases"}>TestCases</Link></li>
                    <li className="nav-item"><Link className="nav-link" to={"/" + this.props.project + "/testsuites"}>Suites</Link></li>
                    <li className="nav-item"><Link className="nav-link" to={"/" + this.props.project + "/launches"}>Launches</Link></li>
                </ul>
            }
              <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <a className="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-login" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
