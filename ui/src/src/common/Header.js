import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
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
            </div>
          </nav>
        );
      }

}

export default Header;
