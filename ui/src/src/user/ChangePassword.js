import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import * as Utils from '../common/Utils';

class ChangePassword extends SubComponent {

    state = {

    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.state[event.target.name] = event.target.value;
        this.setState(this.state);
    }

    handleSubmit(event) {
        axios.post('/api/user/changepass', this.state.password)
        .then(response => {
            Utils.onSuccessMessage("Password successfully updated");
            window.location = "/";
        }).catch(error => {
          Utils.onErrorMessage("Couldn't change password: ", error);
        })
        event.preventDefault();
    }


    render() {
        return (
          <div className="text-center">
          <form className="form-signin">
            <h1 className="h3 mb-3 font-weight-normal">Change Password</h1>
            <input type="password" id="password" name="password" className="form-control" placeholder="New Password"
                  required="" onChange={this.handleChange} />
            <button className="btn btn-lg btn-primary btn-block" onClick={this.handleSubmit}>Submit</button>
          </form>
        </div>
        );
      }

}

export default withRouter(ChangePassword);
