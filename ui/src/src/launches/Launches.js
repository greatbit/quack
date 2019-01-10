import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import queryString from 'query-string';
import Pager from '../pager/Pager';
import * as Utils from '../common/Utils';

class Launches extends SubComponent {

    state = {
        launches: [],
        filter: {
            skip: 0,
            limit: 20
        },
        pager: {
            total: 0,
            current: 0,
            maxVisiblePage: 7,
            itemsOnPage: 20
        }
    };

    constructor(props) {
        super(props);
        this.queryToFilter = this.queryToFilter.bind(this);
        this.filterToQuery = this.filterToQuery.bind(this);
        this.getLaunches = this.getLaunches.bind(this);
        this.getPager = this.getPager.bind(this);
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.updateUrl = this.updateUrl.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.queryToFilter();
        this.getLaunches();
        this.getPager();
        this.intervalId = setInterval(this.getLaunches, 30000);
    }

    handlePageChanged(newPage) {
        this.state.pager.current = newPage;
        this.state.filter.skip = newPage * this.state.pager.itemsOnPage;
        this.getLaunches();
        this.setState(this.state);
        this.updateUrl();
    }

    getLaunches(){
        axios
            .get("/api/" + this.props.match.params.project + "/launch?" + this.filterToQuery(this.state.filter))
            .then(response => {
                 this.state.launches = response.data;
                 this.setState(this.state);
        })
            .catch(error => console.log(error));
    }

    getPager(){
        var countFilter = Object.assign({skip:0, limit:0}, this.state.filter);
        axios
            .get("/api/" + this.props.match.params.project + "/launch/count?" + this.filterToQuery(countFilter))
            .then(response => {
                 this.state.pager.total = response.data;
                 this.state.pager.total.current = this.state.filter.skip / this.state.filter.limit;
                 this.state.pager.visiblePage = Math.min(response.data / this.state.pager.itemsOnPage + 1, this.state.pager.maxVisiblePage);
                 this.setState(this.state);
        })
            .catch(error => console.log(error));
    }

    queryToFilter(){
        var params = queryString.parse(this.props.location.search);
        this.state.filter.skip = params.skip || 0;
        this.state.filter.limit = params.limit || 20;
        this.setState(this.state);
    }

    filterToQuery(filter){
        return Object.keys(filter).
                    map((key) => {return key + "=" + filter[key]}).join("&");
    }

    updateUrl(){
        this.props.history.push("/" + this.props.match.params.project + '/launches?' + this.filterToQuery(this.state.filter));
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
              <table class="table table-striped">
                  <thead>
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Progress</th>
                        <th scope="col">Created</th>
                        <th scope="col">Started</th>
                        <th scope="col">Finished</th>
                      </tr>
                  </thead>
                  <tbody>
                  {
                        this.state.launches.map(function(launch){
                            return (
                                   <tr>
                                       <td>
                                            <Link to={'/' + this.props.match.params.project + '/launch/' + launch.id}>
                                                {launch.name}
                                            </Link>
                                       </td>
                                       <td>{this.getProgressBar(launch)}</td>
                                       <td>{Utils.timeToDate(launch.createdTime)}</td>
                                       <td>{Utils.timeToDate(launch.startTime)}</td>
                                       <td>{Utils.timeToDate(launch.stopTime)}</td>
                                   </tr>
                                   );
                        }.bind(this))
                  }
                  </tbody>
              </table>
              <div>
                  <Pager
                      totalItems={this.state.pager.total}
                      currentPage={this.state.pager.current}
                      visiblePages={this.state.pager.maxVisiblePage}
                      itemsOnPage={this.state.pager.itemsOnPage}
                      onPageChanged={this.handlePageChanged}
                  />
              </div>
          </div>

        );
      }

}

export default Launches;
