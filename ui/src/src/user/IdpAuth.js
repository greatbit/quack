import React, { Component } from "react";
import { withRouter } from "react-router";
import qs from "qs";
import Backend from "../services/backend";
class IdpAuth extends Component {
  render() {
    return <div></div>;
  }

    onSessionChange(session) {
      this.props.onSessionChange(session);
    }

  componentDidMount() {
    Backend.get("user/auth?" + this.props.location.search.substring(1))
      .then(response => {
        this.onSessionChange(response);
        if (response.metainfo && response.metainfo.organizationsEnabled){
            window.location = "/orgselect";
        } else {
            window.location = "/";
        }
      })
      .catch(error => {
        window.location = "/auth";
      });
  }
}

export default withRouter(IdpAuth);
