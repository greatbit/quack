import React, { Component } from "react";
import { withRouter } from "react-router";

import Backend from "../services/backend";
class IdpAuth extends Component {
  render() {
    return <div></div>;
  }

  componentDidMount() {
    Backend.get("user/auth?" + this.props.location.search.substring(1))
      .then(response => {
        window.location = "/";
      })
      .catch(error => {
        console.log(error);
        window.location = "/auth";
      });
  }
}

export default withRouter(IdpAuth);
