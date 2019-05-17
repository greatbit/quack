import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import * as Utils from '../common/Utils';

class LaunchesStatisticsOverview extends SubComponent {

    state = {

    };

    constructor(props) {
        super(props);
        this.state.projectId = props.projectId;
        this.getStats = this.getStats.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.state.filter = Utils.queryToFilter()
        this.state.filter.limit = 0;
        this.state.filter.skip = 0;
        this.getStats();
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.projectId && this.state.projectId != nextProps.projectId){
        this.state.projectId = nextProps.projectId;
        this.getStats();
      }
    }

    getStats(){
        this.setState(this.state);
    }

    render() {
        return (
          <div>
              Overview statistics goes here
          </div>
        );
      }

}

export default withRouter(LaunchesStatisticsOverview);
