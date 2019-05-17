import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import LaunchesStatisticsByUsers from '../launches/LaunchesStatisticsByUsers';
import LaunchesStatisticsOverview from '../launches/LaunchesStatisticsOverview';
import axios from "axios";
import * as Utils from '../common/Utils';

class LaunchesStatistics extends SubComponent {

    state = {};

    constructor(props) {
        super(props);
        this.state.projectId = this.props.match.params.project;
    }

    componentDidMount() {
        super.componentDidMount();
        this.state.projectId = this.props.match.params.project;
    }

    render() {
        return (
          <div className="row">
              <div className="col-6">
                <LaunchesStatisticsOverview projectId={this.state.projectId}/>
              </div>
              <div className="col-6">
                <LaunchesStatisticsByUsers  projectId={this.state.projectId}/>
              </div>
          </div>
        );
      }

}

export default withRouter(LaunchesStatistics);
