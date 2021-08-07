/* eslint-disable eqeqeq */
/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react";
import LaunchForm from "../launches/LaunchForm";
import { withRouter } from "react-router";
import Select from "react-select";
import qs from "qs";
import $ from "jquery";
import * as Utils from "../common/Utils";
import Backend from "../services/backend";
import Filters from "../components/ui/Filters";
const mapOldFilterToNew = filter => ({
  values: filter.attrValues.map(({ value }) => value),
  attribute: filter.id,
});

const getAttributeName = (attributes, id) =>
  (
    attributes.find(function (attribute) {
      return attribute.id === id;
    }) || { attrValues: [] }
  ).name;

const mapOldAttributeToNew = attribute => ({
  id: attribute.id,
  name: attribute.name,
  values: attribute.attrValues?.length
    ? attribute.attrValues
    : attribute.values.map(value => ({ id: value.toLowerCase(), name: value })),
});

const mapNewFilterToOld = attributes => filter => ({
  id: filter.attribute,
  name: getAttributeName(attributes, filter.attribute),
  attrValues: filter.values.map(value => ({ value })),
});

const mapNewFiltersToOld = (attributes, filters) => filters.map(mapNewFilterToOld(attributes));
const mapAttributesToNewFormat = attributes => attributes.map(mapOldAttributeToNew);
class TestCasesFilter extends Component {
  constructor(props) {
    super(props);

    this.defaultFilters = [
      {
        attrValues: [],
      },
    ];

    this.state = {
      groupsToDisplay: [],
      createdLaunch: {
        name: "",
        testSuite: { filter: {} },
        properties: [],
      },
      testSuite: {
        name: "",
        filter: {
          groups: [],
          filters: this.defaultFilters,
        },
      },
      testSuiteNameToDisplay: "",
    };

    this.changeGrouping = this.changeGrouping.bind(this);

    this.handleFilterButtonClick = this.handleFilterButtonClick.bind(this);

    this.handleLaunchClick = this.handleLaunchClick.bind(this);
    this.saveSuite = this.saveSuite.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.suiteAttrChanged = this.suiteAttrChanged.bind(this);
    this.getProjectAttributesSelect = this.getProjectAttributesSelect.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.projectAttributes) {
      this.state.groupsToDisplay.forEach(
        function (groupToDisplay) {
          groupToDisplay.label = getAttributeName(this.props.projectAttributes, groupToDisplay.value);
        }.bind(this),
      );
    }
    this.setState(this.state);
  }

  componentDidMount() {
    var params = qs.parse(this.props.location.search.substring(1));

    if (params.testSuite) {
      Backend.get(this.props.match.params.project + "/testsuite/" + params.testSuite)
        .then(response => {
          this.state.testSuite = response;
          this.state.testSuiteNameToDisplay = this.state.testSuite.name;
          this.state.groupsToDisplay = this.state.testSuite.filter.groups.map(
            function (attrId) {
              return { value: attrId, label: getAttributeName(this.props.projectAttributes, attrId) };
            }.bind(this),
          );
          this.setState(this.state);
          this.props.onFilter(this.state.testSuite.filter);
        })
        .catch(error => {
          Utils.onErrorMessage("Couldn't fetch testsuite: ", error);
        });
    } else {
      if (params.groups) {
        if (!Array.isArray(params.groups)) {
          params.groups = [params.groups];
        }
        this.state.testSuite.filter.groups = params.groups;
        this.state.groupsToDisplay = params.groups.map(
          function (attrId) {
            return { value: attrId, label: getAttributeName(this.props.projectAttributes, attrId) };
          }.bind(this),
        );
      }
      if (params.attribute) {
        if (!Array.isArray(params.attribute)) {
          params.attribute = [params.attribute];
        }
        var map = {};
        params.attribute.forEach(function (pair) {
          var key = pair.split(":")[0];
          var value = pair.split(":")[1];
          if (!map[key]) {
            map[key] = [];
          }
          map[key].push(value);
        });

        Object.keys(map).forEach(
          function (key) {
            this.state.testSuite.filter.filters.push({
              id: key,
              attrValues: map[key].map(val => ({ value: val })),
              title: getAttributeName(this.props.projectAttributes, key),
            });
          }.bind(this),
        );

        if (!this.state.testSuite.filter.filters[0].id) {
          var emptyFilter = this.state.testSuite.filter.filters[0];
          this.state.testSuite.filter.filters.push(emptyFilter);
          this.state.testSuite.filter.filters.shift();
        }
      }
      this.setState(this.state);
      this.props.onFilter(this.state.testSuite.filter);
    }
  }

  changeGrouping(values) {
    this.state.testSuite.filter.groups = values.map(function (value) {
      return value.value;
    });
    this.state.groupsToDisplay = values;
    this.setState(this.state);
  }

<<<<<<< HEAD
  getValuesByAttributeId(id) {
    if (!id) return [];
    if (id == "broken") {
      return [{ value: "true" }, { value: "false" }];
    }
    return (
      this.state.projectAttributes.find(function (attribute) {
        return attribute.id === id;
      }) || { attrValues: [] }
    ).attrValues;
  }

  handleFilter() {
    this.state.testSuite.filter.skip = 0;
=======
  handleFilterButtonClick() {
    console.info(this.state.testSuite.filter);
>>>>>>> dff7d9d (Fixed broken "Filter" button)
    this.props.onFilter(this.state.testSuite.filter);
  }

  handleLaunchClick() {
    this.state.createdLaunch = {
      name: "",
      testSuite: { filter: {} },
      properties: [],
    };
    this.setState(this.state);
    $("#launch-modal").modal("toggle");
  }

  saveSuite(event) {
    var suiteToSave = JSON.parse(JSON.stringify(this.state.testSuite));
    suiteToSave.filter.filters = (suiteToSave.filter.filters || []).filter(function (filter) {
      return filter.id;
    });
    suiteToSave.filter.filters.forEach(function (filter) {
      delete filter.title;
    });
    Backend.post(this.props.match.params.project + "/testsuite/", suiteToSave)
      .then(response => {
        this.state.testSuite = response;
        this.state.testSuiteNameToDisplay = this.state.testSuite.name;
        this.setState(this.state);
        $("#suite-modal").modal("toggle");
        this.props.history.push(
          "/" + this.props.match.params.project + "/testcases?testSuite=" + this.state.testSuite.id,
        );
      })
      .catch(error => {
        Utils.onErrorMessage("Couldn't save testsuite: ", error);
      });
    event.preventDefault();
  }

  handleSaveClick() {
    $("#suite-modal").modal("toggle");
  }

  suiteAttrChanged(event) {
    this.state.testSuite[event.target.name] = event.target.value;
    this.setState(this.state);
  }

  getProjectAttributesSelect() {
    var projectAttributes = this.props.projectAttributes.map(function (val) {
      return { value: val.id, label: val.name };
    });
    return projectAttributes;
  }

  handleFilterChange = value => {
    this.setState({
      ...this.state,
      testSuite: {
        ...this.state.testSuite,
        filter: { ...this.state.testSuite.filter, filters: mapNewFiltersToOld(this.props.projectAttributes, value) },
      },
    });
  };
  render() {
    const newFilters = this.state.testSuite.filter.filters.map(mapOldFilterToNew);
    const newFormatAttributes = mapAttributesToNewFormat(this.props.projectAttributes);
    return (
      <div>
        <h2>{this.state.testSuiteNameToDisplay}</h2>
        <div>
          <div className="row filter-control-row flex items-center">
            <div className="col-1 text-neutral font-semibold text-left">Grouping</div>
            <div className="col-5 grouping-control">
              <Select
                value={this.state.groupsToDisplay}
                isMulti
                onChange={this.changeGrouping}
                options={this.getProjectAttributesSelect().filter(attr => attr.value != "broken")}
              />
            </div>
            <div className="col-2"></div>
            <div className="col-4 btn-group" role="group">
              <button type="button" className="btn btn-primary" onClick={this.handleFilterButtonClick}>
                Filter
              </button>
              <button type="button" className="btn btn-warning" onClick={this.handleSaveClick}>
                Save
              </button>
              <button type="button" className="btn btn-success" onClick={this.handleLaunchClick}>
                Launch
              </button>
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editTestcase">
                Add Test Case
              </button>
            </div>
          </div>
          <div className="flex items-center mb-3">
            <div className="col-1 pl-0 text-left font-semibold text-neutral">Filter</div>
            <Filters attributes={newFormatAttributes} value={newFilters} onChange={this.handleFilterChange} />
          </div>
        </div>
        <div
          className="modal fade"
          id="launch-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="launchLabel"
          aria-hidden="true"
        >
          <LaunchForm launch={this.state.createdLaunch} testSuite={this.state.testSuite} />
        </div>

        <div
          className="modal fade"
          id="suite-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="suiteLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editAttributeLabel">
                  Test Suite
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div>
                <div className="modal-body" id="suite-save-form">
                  <form>
                    <div className="form-group row">
                      <label className="col-sm-3 col-form-label">Name</label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          onChange={this.suiteAttrChanged}
                          defaultValue={this.state.testSuiteNameToDisplay}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={this.saveSuite}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(TestCasesFilter);
