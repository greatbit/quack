import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from "axios";

class Auth extends Component {
    render() {
        return (
          <div>

          </div>
        );
      }

    componentDidMount() {
        axios
          .get("/api/user/login-redirect")
          .then(response => {
            var url = response.data.url || "/login";
            if (response.data.retpathParamName){
                url = url + response.data.retpathParamName + "=" + encodeURI(window.location.href)
            }
            this.props.history.push(url);
          })
          .catch(error => console.log(error));
    }

}

export default withRouter(Auth);
