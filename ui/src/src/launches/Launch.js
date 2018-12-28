import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";

class Launch extends SubComponent {

    state = {
        launch: {}
    };

    constructor(props) {
        super(props);
        this.getLaunch = this.getLaunch.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.getLaunch();
    }

    getLaunch(){
        axios
            .get("/api/" + this.props.match.params.project + "/launch/" + this.props.match.params.launchId)
            .then(response => {
                 this.state.launch = response.data;
                 this.setState(this.state);
        })
            .catch(error => console.log(error));
    }

    render() {
        return (
          <div>
              Launch Here
          </div>
        );
      }

}

export default Launch;
