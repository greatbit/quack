import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from "axios";
import queryString from 'query-string';

class Auth extends Component {
    render() {
        return (
          <div>

          </div>
        );
      }

    componentDidMount() {
        var params = queryString.parse(this.props.location.search);
        axios
          .get("/api/user/login-redirect")
          .then(response => {
            var url = response.data.url || "/login";
            if (response.data.retpathParamName){
                url = url + response.data.retpathParamName + "=" + encodeURIComponent(params.retpath || "");
            } else  {
                  url = url + "?retpath=" + encodeURIComponent(params.retpath || "");
            }

            //TOdo: if (retpath.startsWith("/auth") || retpath.startsWith("/login")){retpath = "/";}


            this.props.history.push(url);
          })
          .catch(error => console.log(error));
    }

}

export default withRouter(Auth);
