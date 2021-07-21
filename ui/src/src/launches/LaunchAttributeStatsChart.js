import React from "react";
import { withRouter } from "react-router";
import SubComponent from "../common/SubComponent";
import Highcharts from "highcharts";
import * as Utils from "../common/Utils";

class LaunchAttributeStatsChart extends SubComponent {
  state = {
    data: {},
    attrKey: "",
    statusSeries: [],
  };

  constructor(props) {
    super(props);
    this.getChartContainerId = this.getChartContainerId.bind(this);
    this.setUpStatusSeries = this.setUpStatusSeries.bind(this);
    this.statusChartRender = this.statusChartRender.bind(this);

    this.seriesConfig = Utils.getChartSeriesConfig();

    this.state.data = props.stats;
    this.state.attrKey = props.attrKey;
  }

  componentDidMount() {
    this.setUpStatusSeries();
    this.statusChartRender();
  }

  statusChartRender() {
    Highcharts.chart({
      chart: {
        type: "column",
        renderTo: this.getChartContainerId(),
      },
      title: {
        text: this.state.data.name,
      },
      xAxis: {
        categories: Object.keys(this.state.data.values),
      },
      yAxis: {
        title: {
          text: "Testcases",
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.y > 0) return this.y;
            },
          },
        },
      },
      series: this.state.statusSeries,
    });
  }

  setUpStatusSeries() {
    this.state.statusSeries = Object.keys(this.seriesConfig).map(statusKey => {
      return {
        name: statusKey,
        color: this.seriesConfig[statusKey].color,
        data: Object.keys(this.state.data.values).map(attrValue => {
          return {
            name: this.seriesConfig[statusKey].name,
            y: this.state.data.values[attrValue][statusKey],
          };
        }),
      };
    });
  }

  getChartContainerId() {
    return "launch-attr-stats-" + this.state.attrKey;
  }

  render() {
    return (
      <div id={this.getChartContainerId()} className="launch-attr-stats-chart">
        Chart here
      </div>
    );
  }
}

export default withRouter(LaunchAttributeStatsChart);
