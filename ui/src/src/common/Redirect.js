import React, { Component } from "react";
import { withRouter } from "react-router";

import backend from "../services/backend";

class Redirect extends Component {
  constructor(props) {
    super(props);
    this.requestUrl = this.props.requestUrl;
  }

  render() {
    return <div></div>;
  }

  componentDidMount() {
    backend
      .get(this.requestUrl)
      .then(response => {
        window.location = response.url;
      })
      .catch(error => console.log(error));
  }
}

export default withRouter(Redirect);
