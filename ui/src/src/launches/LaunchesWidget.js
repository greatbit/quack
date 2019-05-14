import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import qs from 'qs';
import Pager from '../pager/Pager';
import * as Utils from '../common/Utils';
import { FadeLoader } from 'react-spinners';

class LaunchesWidget extends SubComponent {

    state = {
        launches: [],
        loading: true
    };

    constructor(props) {
        super(props);
        this.limit = props.limit || 5;
        this.projectId = props.projectId;
        this.getLaunches = this.getLaunches.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.getLaunches();
    }

    getLaunches(){
        axios
            .get("/api/" + this.projectId + "/launch?includedFields=name,id&orderby=id&orderdir=DESC&limit=" + this.limit)
            .then(response => {
                 this.state.launches = response.data;
                 this.state.loading = false;
                 this.setState(this.state);
        }).catch(error => {
            Utils.onErrorMessage("Couldn't get launch: " + error.response.data.message);
            this.state.loading = false;
            this.setState(this.state);
        });
    }

    getProgressBar(launch){
        return (
            <div class="progress">
              <div class="progress-bar progress-bar-striped" role="progressbar" style={this.getProgressStyle(launch.launchStats.statusCounters.RUNNING, launch.launchStats.total)}></div>
              <div class="progress-bar bg-success" role="progressbar" style={this.getProgressStyle(launch.launchStats.statusCounters.PASSED, launch.launchStats.total)}></div>
              <div class="progress-bar bg-danger" role="progressbar" style={this.getProgressStyle(launch.launchStats.statusCounters.FAILED, launch.launchStats.total)}></div>
              <div class="progress-bar bg-warning" role="progressbar" style={this.getProgressStyle(launch.launchStats.statusCounters.BROKEN, launch.launchStats.total)}></div>
            </div>
        )
    }

    getProgressStyle(value, total){
        return {width:  (value * 100) / total + '%'};
    }

    render() {
        return (
          <div>
              <div className='sweet-loading'>
                     <FadeLoader
                       sizeUnit={"px"}
                       size={100}
                       color={'#135f38'}
                       loading={this.state.loading}
                     />
               </div>
              <table class="table table-striped">
                  <thead>
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Progress</th>
                      </tr>
                  </thead>
                  <tbody>
                  {
                        this.state.launches.map(function(launch){
                            return (
                                   <tr>
                                       <td>
                                            <Link to={'/' + this.projectId + '/launch/' + launch.id}>
                                                {launch.name}
                                            </Link>
                                       </td>
                                       <td>{this.getProgressBar(launch)}</td>
                                   </tr>
                                   );
                        }.bind(this))
                  }
                  </tbody>
              </table>
          </div>

        );
      }

}

export default LaunchesWidget;
