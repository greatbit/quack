import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from "axios";

class Redirect extends Component {

    constructor(props) {
        super(props);
        this.requestUrl = this.props.requestUrl;
    }

    render() {
        return (
          <div>

          </div>
        );
      }

    componentDidMount() {
        axios
          .get(this.requestUrl)
          .then(response => {
            window.location = response.data.url;
          })
          .catch(error => console.log(error));
    }

}

export default withRouter(Redirect);
