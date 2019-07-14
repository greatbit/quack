import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import CreatableSelect from 'react-select/lib/Creatable';
import LauncherForm from '../launches/LauncherForm';
import $ from 'jquery';
import * as Utils from '../common/Utils';


class LaunchForm extends SubComponent {
    constructor(props) {
        super(props);
        this.state = {
             launch: {
                 name: "",
                 testSuite: {filter: {}},
                 properties: [],
                 launcherConfig: {properties: {}}
             },
             project: {
                  id: null,
                  name: "",
                  description: "",
                  allowedGroups: [],
                  launcherConfigs: []
              },
             launcherDescriptors: []
         };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLauncherChange = this.handleLauncherChange.bind(this);
      }

      handleChange(event) {
        this.state.launch[event.target.name] = event.target.value;
        this.setState(this.state);
      }

      handleSubmit(event) {
        this.state.launch.testSuite.filter.filters = (this.state.launch.testSuite.filter.filters || []).
            filter(function(filter){return filter.id !== undefined && filter.id !== null});
        this.state.launch.testSuite.filter.filters.forEach(function(filter){
            delete filter.title;
        })
        axios.post('/api/' + this.props.match.params.project + '/launch/', this.state.launch)
        .then(response => {
            this.state.launch = response.data;
            this.setState(this.state);
        }).catch(error => {Utils.onErrorMessage("Couldn't save launch: ", error)});
        event.preventDefault();
      }

    componentWillReceiveProps(nextProps) {
      if(nextProps.testSuite){
          this.state.launch.testSuite = nextProps.testSuite;
      }
      if(nextProps.launch){
          this.state.launch = nextProps.launch;
      }
      this.setState(this.state);
    }

    componentDidMount() {
        super.componentDidMount();

        axios
          .get("/api/project/" + this.props.match.params.project)
          .then(response => {
            this.state.project = response.data;
            this.setState(this.state);
          }).catch(error => {Utils.onErrorMessage("Couldn't get project: ", error)});

        axios
            .get("/api/launcher/descriptors")
            .then(response => {
              this.state.launcherDescriptors = response.data;
              this.setState(this.state);
            }).catch(error => {Utils.onErrorMessage("Couldn't get launcher descriptors: ", error)});
    }

    handleLauncherChange(event, index, propertyKey){
       if(propertyKey == 'uuid'){
            this.state.launch.launcherConfig = this.state.project.launcherConfigs.find(config => config.uuid == event.target.value);
        } else {
            this.state.launch.launcherConfig.properties[propertyKey] = event.target.value;
        }
        this.setState(this.state);
    }

    render() {
        let modalBody;
        if (this.state.launch.id){
            modalBody = <div className="modal-body" id="launch-created">
                            <Link to={'/' + this.props.match.params.project + '/launch/' + this.state.launch.id} className='dropdown-item'>Go To Launch</Link>
                        </div>
        } else {
            modalBody =
                <div className="modal-body" id="launch-creation-form">
                    <form>
                        <div className="form-group row">
                            <label className="col-4 col-form-label">Name</label>
                            <div className="col-8">
                                <input type="text" className="form-control" name="name" onChange={this.handleChange} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-4 col-form-label">Launcher</label>
                            <div className="col-8">
                                <select id="launcherUUID" className="form-control" onChange={(e) => this.handleLauncherChange(e, 0, "uuid")}>
                                    <option> </option>
                                    {
                                        this.state.project.launcherConfigs.map(function(config){
                                            var selected = config.uuid == (this.state.launch.launcherConfig || {}).uuid;
                                            if (selected){
                                                return (<option value={config.uuid} selected>{config.name}</option>)
                                            }
                                            return (<option value={config.uuid} >{config.name}</option>)

                                        }.bind(this))
                                    }
                                </select>
                            </div>
                         </div>
                    </form>
                    <div>
                        <LauncherForm launcherConfig={this.state.launch.launcherConfig} configIndex={0} selectableType={false}
                            handleLauncherChange={this.handleLauncherChange} launcherDescriptors={this.state.launcherDescriptors}/>
                    </div>
                </div>
        }


        return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Create Launch</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div>{modalBody}</div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    {!this.state.launch.id &&
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Create Launch</button>
                    }
                  </div>
                </div>
             </div>
        );
      }


}

export default withRouter(LaunchForm);
