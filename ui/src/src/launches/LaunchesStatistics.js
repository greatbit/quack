import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import axios from "axios";
import * as Utils from '../common/Utils';

class LaunchesStatistics extends SubComponent {

    state = {
        stats: {
            all: {
                launchTimes: {}
            }
        }
    };

    constructor(props) {
        super(props);
        this.state.projectId = this.props.match.params.project;
        this.getStats = this.getStats.bind(this);
        this.statusPieChartRender = this.statusPieChartRender.bind(this);
        this.setUpStatusPieSeries = this.setUpStatusPieSeries.bind(this);
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
                 this.setState(this.state);
                 this.statusPieChartRender();
        }).catch(error => {
            Utils.onErrorMessage("Couldn't get launch statistics: " + (error.response || {data: {message: ""}}).data.message);
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
                  color: '#3498db'
                },
                {
                  name: 'Failed',
                  y: this.state.stats.all.launchStats.statusCounters.FAILED,
                  color: '#9b59b6'
                },
                {
                  name: 'Broken',
                  y: this.state.stats.all.launchStats.statusCounters.BROKEN,
                  color: '#2ecc71'
                },
                {
                  name: 'Skipped',
                  y: this.state.stats.all.launchStats.statusCounters.SKIPPED,
                  color: '#f1c40f'
                },
                {
                  name: 'Runnable',
                  y: this.state.stats.all.launchStats.statusCounters.RUNNABLE,
                  color: '#f1c40f'
                },
                {
                  name: 'Running',
                  y: this.state.stats.all.launchStats.statusCounters.RUNNING,
                  color: '#f1c40f'
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

    render() {
        return (
          <div className="row">
              <div className="col-3">
                <table class="table">
                  <tbody>
                    <tr>
                      <td>Total Launches</td>
                      <td>{this.state.stats.all.launchCount || 0}</td>
                    </tr>
                    <tr>
                      <td>First Started</td>
                      <td>{Utils.timeToDate(this.state.stats.all.launchTimes.firstStart || 0)}</td>
                    </tr>
                    <tr>
                      <td>Last Finished</td>
                      <td>{Utils.timeToDate(this.state.stats.all.launchTimes.lastFinish || 0)}</td>
                    </tr>
                    <tr>
                      <td>Total Duration</td>
                      <td>{Utils.timePassed(this.state.stats.all.launchTimes.duration || 0)}</td>
                    </tr>
                    <tr>
                      <td>Idle Time</td>
                      <td>{Utils.timePassed(this.state.stats.all.launchTimes.idle || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-6" id="pie-by-statuses">

              </div>
          </div>
        );
      }

}

export default withRouter(LaunchesStatistics);
