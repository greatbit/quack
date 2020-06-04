import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from "axios";

class CreateUserRedirect extends Component {
    render() {
        return (
          <div>

          </div>
        );
      }

    componentDidMount() {
        axios
          .get("/api/user/create-redirect")
          .then(response => {
            window.location = response.data.url;
          })
          .catch(error => console.log(error));
    }

}

export default withRouter(CreateUserRedirect);
