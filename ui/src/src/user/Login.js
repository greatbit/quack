import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from "axios";

class Login extends Component {
    render() {
        return (
          <div className="text-center">
            <form class="form-signin">
              <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
              <label for="login" class="sr-only">Login</label>
              <input type="text" id="login" class="form-control" placeholder="Login" required="" autofocus="" />
              <label for="password" class="sr-only">Password</label>
              <input type="password" id="password" class="form-control" placeholder="Password" required="" />
              <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
          </div>
        );
      }

}

export default withRouter(Login);
