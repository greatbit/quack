import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from "axios";

class Header extends Component {

    constructor(props) {
        super(props);
        this.emptyState = {session : {person: {firstName: "Guest"}}};
        this.state = this.emptyState;
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        var that = this;
        axios
          .get("/api/user/session")
          .then(response => {
            this.state.session = response.data;
            this.setState(this.state);
          })
          .catch(error => this.props.history.push("/auth"));
    }

    logOut(){
        axios
          .delete("/api/user/logout")
          .then(response => {
            const newState = Object.assign({}, this.state, this.emptyState);
            this.setState(this.state);
            this.props.history.push("/auth");
          })
          .catch(error => console.log(error));
    }

    render() {
        let profileContext;
        if (this.state.session.id){
            profileContext = (
            <span>
                <a class="dropdown-item" href="/user/profile">Profile</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" onClick={this.logOut}>Log out</a>
            </span>
            )
          } else {
            profileContext = <a class="dropdown-item active" href="/auth">Login</a>
        }

        return (
          <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <Link className="navbar-brand" to="/">QuAck</Link>
            <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item"><Link className="nav-link" to="/projects">Projects</Link></li>
                <li className="nav-item"><Link className="nav-link" to={"/" + this.props.project + "/attributes"}>Attributes</Link></li>
                <li className="nav-item"><Link className="nav-link" to={"/" + this.props.project + "/testcases"}>TestCases</Link></li>
                <li className="nav-item"><Link className="nav-link" to={"/" + this.props.project + "/testsuites"}>Suites</Link></li>
                <li className="nav-item"><Link className="nav-link" to={"/" + this.props.project + "/launches"}>Launches</Link></li>
              </ul>
              <ul class="navbar-nav">
                  <li class="nav-item dropdown">
                    <a class="nav-item nav-link dropdown-toggle mr-md-2" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {this.state.session.person.firstName || ""} {this.state.session.person.lastName || ""}
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="bd-versions">
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
