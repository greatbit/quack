import React, { Component } from 'react';
import { withRouter } from 'react-router';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import Highcharts from 'highcharts';
import * as Utils from '../common/Utils';

import $ from 'jquery';


class LaunchAttributeStatsPieChart extends SubComponent {

    state = {
        data: {
        },
        attrKey: "",
        statusSeries: []
    };

    constructor(props) {
        super(props);
        this.getChartContainerId = this.getChartContainerId.bind(this);
        this.setUpStatusSeries = this.setUpStatusSeries.bind(this);
        this.statusChartRender = this.statusChartRender.bind(this);

        this.state.data = props.stats;
        this.state.attrKey = props.attrKey;
        this.setUpStatusSeries();
        this.setState(this.state);
//
//        console.log(this.state);
//
//


    }

    componentDidMount() {
        super.componentDidMount();
        this.statusChartRender();
    }

    statusChartRender() {
        Highcharts.chart({
            chart: {
              type: 'column',
              renderTo: this.getChartContainerId()
            },
            title: {
              verticalAlign: 'middle',
              floating: true,
              text: this.state.data.name,
              style: {
                fontSize: '10px',
              }
            },
            xAxis: {
                categories: Object.keys(this.state.data.values)
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: this.state.statusSeries
        });
    }

    setUpStatusSeries(){
        var seriesConfig = Utils.getChartSeriesConfig();
        this.state.statusSeries = Object.keys(seriesConfig).map(statusKey => {
            return {
                name: statusKey,
                data: Object.keys(this.state.data.values)
                        .filter(attrValue => this.state.data.values[attrValue][statusKey] > 0)
                        .map(attrValue => {
                    return {
                             name: seriesConfig[statusKey].name,
                             y: this.state.data.values[attrValue][statusKey],
                             color: seriesConfig[statusKey].color
                           }
                })
            }

        })

    }

    getChartContainerId(){
        return "launch-attr-stats-" + this.state.attrKey;
    }

    render() {
        return (
          <div id={this.getChartContainerId()}>
              Chart here
          </div>
        );
     }



}

export default withRouter(LaunchAttributeStatsPieChart);
