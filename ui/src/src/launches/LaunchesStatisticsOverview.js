import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SubComponent from '../common/SubComponent'
import LaunchesTrendWidget from '../launches/LaunchesTrendWidget'
import { Link } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import Highcharts from 'highcharts';
import axios from "axios";
import * as Utils from '../common/Utils';

class LaunchesStatisticsOverview extends SubComponent {

    state = {
        stats: {
            all: {
                launchTimes: {}
            }
        },
        loading: true
    };

    constructor(props) {
        super(props);
        this.state.projectId = this.props.match.params.project;
        this.getStats = this.getStats.bind(this);
        this.statusPieChartRender = this.statusPieChartRender.bind(this);
        this.setUpStatusPieSeries = this.setUpStatusPieSeries.bind(this);
        this.setUpUsersPieSeries = this.setUpUsersPieSeries.bind(this);
        this.usersPieChartRender = this.usersPieChartRender.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.state.projectId = this.props.match.params.project;
        this.getStats();
    }

    getStats(){
        axios
            .get("/api/" + this.state.projectId + "/launch/statistics" + this.props.location.search)
            .then(response => {
                 this.state.stats = response.data;
                 this.setUpStatusPieSeries();
                 this.setUpUsersPieSeries();
                 this.state.loading = false;
                 this.setState(this.state);
                 this.statusPieChartRender();
                 this.usersPieChartRender();
        }).catch(error => {
            Utils.onErrorMessage("Couldn't get launch statistics: ", error);
            this.state.loading = false;
            this.setState(this.state);
        });
    }

    setUpStatusPieSeries(){
        this.state.statusSeries = [{
              name: 'Statuses',
              data: [
                {
                  name: 'Passed',
                  y: this.state.stats.all.launchStats.statusCounters.PASSED,
                  color: '#28a745'
                },
                {
                  name: 'Failed',
                  y: this.state.stats.all.launchStats.statusCounters.FAILED,
                  color: '#dc3545'
                },
                {
                  name: 'Broken',
                  y: this.state.stats.all.launchStats.statusCounters.BROKEN,
                  color: '#ffc107'
                },
                {
                  name: 'Skipped',
                  y: this.state.stats.all.launchStats.statusCounters.SKIPPED,
                  color: '#6c757d'
                },
                {
                  name: 'Runnable',
                  y: this.state.stats.all.launchStats.statusCounters.RUNNABLE,
                  color: '#7cb5ec'
                },
                {
                  name: 'Running',
                  y: this.state.stats.all.launchStats.statusCounters.RUNNING,
                  color: '#007bff'
                }
              ]
            }]

    }

    statusPieChartRender() {
    	Highcharts.chart({
    	    chart: {
    	      type: 'pie',
    	      renderTo: 'pie-by-statuses'
    	    },
    	    title: {
    	      verticalAlign: 'middle',
    	      floating: true,
    	      text: 'Statuses',
    	      style: {
    	      	fontSize: '10px',
    	      }
    	    },
    	    plotOptions: {
    	      pie: {
    	      	dataLabels: {
    	      		format: '{point.name}: {point.percentage:.1f} %'
    	      	},
    	        innerSize: '70%'
    	      }
    	    },
    	    series: this.state.statusSeries
      	});
    }

    setUpUsersPieSeries(){
        this.state.userSeries = [{
              name: 'Statuses',
              data: Object.keys(this.state.stats.all.users).map(function(user){return {name: user, y: this.state.stats.all.users[user]}}.bind(this))
        }]
    }

    usersPieChartRender() {
    	Highcharts.chart({
    	    chart: {
    	      type: 'pie',
    	      renderTo: 'pie-by-users'
    	    },
    	    title: {
    	      verticalAlign: 'middle',
    	      floating: true,
    	      text: 'Users',
    	      style: {
    	      	fontSize: '10px',
    	      }
    	    },
    	    plotOptions: {
    	      pie: {
    	      	dataLabels: {
    	      		format: '{point.name}: {point.percentage:.1f} %'
    	      	},
    	        innerSize: '70%'
    	      }
    	    },
    	    series: this.state.userSeries
      	});
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
          <div className="row">
              <div className="col-6">
                <table class="table">
                  <tbody>
                    <tr>
                      <td>Total Launches: {this.state.stats.all.launchCount || 0}</td>
                      <td>Total Duration: {Utils.timePassed(this.state.stats.all.launchTimes.duration || 0)}</td>
                      <td>Idle Time: {Utils.timePassed(this.state.stats.all.launchTimes.idle || 0)}</td>
                    </tr>
                    <tr>
                      <td>First Started: {Utils.timeToDate(this.state.stats.all.launchTimes.firstStart || 0)}</td>
                      <td>Last Finished: {Utils.timeToDate(this.state.stats.all.launchTimes.lastFinish || 0)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
          </div>
          <div className="row">
            <div className="col-6" id="pie-by-statuses"/>
            <div className="col-6" id="pie-by-users"/>
          </div>
          <div className="row">
            <div className="col-6">
                <LaunchesTrendWidget projectId={this.state.projectId}
                    filter={Utils.queryToFilter(this.props.location.search.substring(1))}/>
            </div>
          </div>
        </div>
        );
      }

}

export default withRouter(LaunchesStatisticsOverview);
