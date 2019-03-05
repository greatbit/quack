import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from "axios";
import queryString from 'query-string';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
             login: "",
             password: ""
         };
         this.handleChange = this.handleChange.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.onSessionChange = this.onSessionChange.bind(this);
    }

    onSessionChange(session){
        this.props.onSessionChange(session);
    }

    handleChange(event) {
        this.state[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    handleSubmit(event) {
        axios.post('/api/user/login?login=' + this.state.login + '&password=' + this.state.password)
        .then(response => {
            this.onSessionChange(response.data);
            var params = queryString.parse(this.props.location.search);
            var retpath = decodeURIComponent(params.retpath) || "/";
            window.location = decodeURI(retpath);
        })
        event.preventDefault();
    }


    render() {
        return (
          <div className="text-center">
            <form class="form-signin">
              <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
              <label for="login" class="sr-only">Login</label>
              <input type="text" id="login" name="login" class="form-control"
                        placeholder="Login" required="" autofocus="" onChange={this.handleChange} />
              <label for="password" class="sr-only">Password</label>
              <input type="password" id="password" name="password" class="form-control" placeholder="Password"
                    required="" onChange={this.handleChange} />
              <button class="btn btn-lg btn-primary btn-block" onClick={this.handleSubmit}>Sign in</button>
            </form>
          </div>
        );
      }

}

export default withRouter(Login);
