import LaunchForm from "../launches/LaunchForm";
import Filters from "../components/ui/Filters";
import Listbox from "../components/ui/ListBox";
import SelectedValues from "../components/ui/SelectedValues";
import { useRef, useState } from "react";
import SuiteDialog from "../components/suite/Dialog";

const mapOldFilterToNew = filter => ({
  values: filter.attrValues.map(({ value }) => value),
  attribute: filter.id,
});

<<<<<<< HEAD
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
=======
const TestCasesFilter = ({
  suite,
  projectAttributes,
  groups,
  filters,
  onChangeGroups,
  onChangeFilters,
  onSubmitSuiteDialog,
}) => {
  const [showSuiteDialog, setShowSuiteDialog] = useState(false);
  const handleLaunchClick = () => {
>>>>>>> 2fb342d (TestCases / TestCaseFilters refactoring)
    this.state.createdLaunch = {
      name: "",
      testSuite: { filter: {} },
      properties: [],
    };
    this.setState(this.state);
  };

  const handleSaveClick = () => {
    setShowSuiteDialog(true);
  };

  const handleRemoveGroupClick = (e, value) => {
    e.stopPropagation();
    onChangeGroups(groups.filter(group => group !== value));
  };

  const handleChangeGroups = value => {
    onChangeGroups(groups.includes(value) ? groups.filter(item => item !== value) : [...groups, value]);
  };

  // const groupIdsToDisplay = this.state.testSuite.filter.groups;
  const projectAttributesToGroupBy = projectAttributes.filter(attribute => attribute.id !== "broken");
  return (
    <>
      <h2 className="text-xl text-neutral">{suite?.name}</h2>
      <div>
        <div className="row filter-control-row md:flex items-center">
          <div className="col-1 text-neutral font-semibold text-left">Grouping</div>
          <div className="col-5 grouping-control">
            {projectAttributes.length > 0 && (
              <Listbox
                value={groups}
                onChange={handleChangeGroups}
                label={
                  groups.length ? (
                    <SelectedValues
                      onRemoveClick={handleRemoveGroupClick}
                      values={groups}
                      allValues={projectAttributes}
                    />
                  ) : (
                    <Listbox.Placeholder>Select grouping</Listbox.Placeholder>
                  )
                }
              >
                {projectAttributesToGroupBy.map(attribute => (
                  <Listbox.Option key={attribute.id} value={attribute.id} forceSelected={groups.includes(attribute.id)}>
                    {attribute.name}
                  </Listbox.Option>
                ))}
              </Listbox>
            )}
          </div>
          <div className="col-2"></div>
          <div className="col-4 btn-group" role="group">
            <button type="button" className="btn btn-warning" onClick={handleSaveClick}>
              Save
            </button>
            <button type="button" className="btn btn-success" onClick={handleLaunchClick}>
              Launch
            </button>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editTestcase">
              Add Test Case
            </button>
          </div>
        </div>
        <div className="md:flex mb-3">
          <div className="col-1 pl-0 flex-shrink-0 pt-2 text-left font-semibold text-neutral">Filter</div>
          {projectAttributes?.length && (
            <Filters attributes={projectAttributes} value={filters} onChange={onChangeFilters} />
          )}
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
        <LaunchForm launch={null} testSuite={null} />
      </div>

      <SuiteDialog
        initialValues={{ name: "" }}
        open={showSuiteDialog}
        onSubmit={onSubmitSuiteDialog}
        onCancel={() => setShowSuiteDialog(false)}
      />
    </>
  );
};

export default TestCasesFilter;
