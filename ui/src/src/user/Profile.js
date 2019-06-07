import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import * as Utils from '../common/Utils';

class Profile extends SubComponent {

    state = {
        profile:{}
    };

    constructor(props) {
        super(props);
        this.getUser = this.getUser.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.state.profile.id = this.props.match.params.profileId;
        this.getUser();
    }

    getUser(){
        axios
          .get("/api/user/" + this.state.profile.id)
          .then(response => {
            this.state.profile = response.data;
            this.setState(this.state);
          }).catch(error => {Utils.onErrorMessage("Couldn't get user: ", error)});
     }


    render() {
        return (
          <div>
              <h1>{this.state.profile.firstName} {this.state.profile.lastName}</h1>
          </div>
        );
      }

}

export default withRouter(Profile);
