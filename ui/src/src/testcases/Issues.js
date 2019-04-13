import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import $ from 'jquery';
import axios from "axios";

class Issues extends SubComponent {
    constructor(props) {
        super(props);

        this.defaultIssue = {
            name: "",
            type: {},
            description: "",
            priority: {},
            trackerProject: {}
        }

        this.state = {
             projectId: props.projectId,
             testcase: props.testcase || {issues: []},
             issue: Object.assign({}, this.defaultIssue),
             linkIssueView: {},
             suggestIssues: [],
             suggestTrackerProjects: [],
             issueTypes: [],
             issuePriorities: []
         };

         this.unlinkIssue = this.unlinkIssue.bind(this);
         this.getIssueUrl = this.getIssueUrl.bind(this);
         this.createIssue = this.createIssue.bind(this);
         this.handleChange = this.handleChange.bind(this);
         this.handleSelectChange = this.handleSelectChange.bind(this);
         this.changeLinkIssueId = this.changeLinkIssueId.bind(this);
         this.suggestIssues = this.suggestIssues.bind(this);
         this.suggestProjects = this.suggestProjects.bind(this);
         this.linkIssue = this.linkIssue.bind(this);
         this.changeTrackerProject = this.changeTrackerProject.bind(this);
         this.mapIssuePrioritiesToView = this.mapIssuePrioritiesToView.bind(this);
         this.mapIssueTypesToView = this.mapIssueTypesToView.bind(this);
         this.changeIssueType = this.changeIssueType.bind(this);
         this.changeIssuePriority = this.changeIssuePriority.bind(this);
      }

    componentWillReceiveProps(nextProps) {
      if(nextProps.testcase){
        this.state.testcase = nextProps.testcase;
      }
      if(nextProps.projectId){
        this.state.projectId = nextProps.projectId;
        axios.get('/api/' + this.state.projectId + '/testcase/issue/projects')
            .then(response => {
                 this.state.suggestedTrackerProjects = response.data;
                 this.setState(this.state);
        })
      }
      this.setState(this.state);
    }

    componentDidMount(){
        super.componentDidMount();
        this.onTestcaseUpdated = this.props.onTestcaseUpdated;
    }

    unlinkIssue(issueId){
        axios.delete('/api/' + this.state.projectId + '/testcase/' + this.state.testcase.id  + '/issue/' + issueId)
            .then(response => {
                this.onTestcaseUpdated();
        })
    }

    createIssue(event){
        axios.post('/api/' + this.state.projectId + '/testcase/' + this.state.testcase.id + '/issue' , this.state.issue)
            .then(response => {
                $('#issue-modal').modal('hide');
                this.state.issue = Object.assign({}, this.defaultIssue);
                this.onTestcaseUpdated();
        })
        event.preventDefault();
    }

    linkIssue(event){
        axios.post('/api/' + this.state.projectId + '/testcase/' + this.state.testcase.id + '/issue/link/' + this.state.linkIssueView.value || "" , this.state.issue)
            .then(response => {
                this.state.linkIssueView = {};
                $('#issue-modal').modal('hide');
                this.onTestcaseUpdated();
        })
        event.preventDefault();

    }

    handleChange(event) {
       this.state.issue[event.target.name] = event.target.value;
       this.setState(this.state);
    }

    handleSelectChange(value, event) {
       this.state.issue[event.name] = value.value;
       this.setState(this.state);
    }

    suggestIssues(value, callback){
        axios.get('/api/' + this.state.projectId + '/testcase/issue/suggest?text=' + value)
            .then(response => {
                 this.state.suggestedIssues = response.data;
                 this.setState(this.state);
                 callback(this.mapIssuesToView(this.state.suggestedIssues));
        })
    }

    suggestProjects(value, callback){
        axios.get('/api/' + this.state.projectId + '/testcase/issue/projects/suggest?text=' + value)
            .then(response => {
                 this.state.suggestedTrackerProjects = response.data;
                 this.setState(this.state);
                 callback(this.mapTrackerProjectsToView(this.state.suggestedTrackerProjects));
        })
    }

    changeLinkIssueId(value){
        this.state.linkIssueView = value;
        this.setState(this.state);
    }

    changeTrackerProject(value){
        this.state.issue.trackerProject = {name: value.label, id: value.value};
        this.setState(this.state);


        axios.get('/api/' + this.state.projectId + '/testcase/issue/types?project=' + this.state.issue.trackerProject.id)
            .then(response => {
                 this.state.issueTypes = response.data;
                 this.setState(this.state);
        })

        axios.get('/api/' + this.state.projectId + '/testcase/issue/priorities?project=' + this.state.issue.trackerProject.id)
            .then(response => {
                 this.state.issuePriorities = response.data;
                 this.setState(this.state);
        })
    }

    changeIssueType(value){
        this.state.issue.type = {name: value.label, id: value.value};
        this.setState(this.state);
    }

    changeIssuePriority(value){
        this.state.issue.priority = {name: value.label, id: value.value};
        this.setState(this.state);
    }


    mapIssuesToView(issues){
        return (issues || []).map(function(issue){return {value: issue.id, label: issue.name}});
    }

    mapTrackerProjectsToView(trackerProjects){
        return (trackerProjects || []).map(function(trackerProject){return {value: trackerProject.id, label: trackerProject.name}});
    }

    mapIssueTypesToView(issueTypes){
        return (issueTypes || []).map(function(issueType){return {value: issueType.id, label: issueType.name}});
    }

    mapIssuePrioritiesToView(issuePriorities){
        return (issuePriorities || []).map(function(issuePriority){return {value: issuePriority.id, label: issuePriority.name}});
    }

    getIssueUrl(issue){
        return (
            <tr>
                <td>
                    <a href={issue.url || ""} target='_blank'>{issue.name}</a>
                </td>
                <td>
                    {issue.type.name}
                </td>
                <td>
                    {issue.priority.name}
                </td>
                <td>
                    <span className="clickable edit-icon-visible red" onClick={(e) => this.unlinkIssue(issue.id, e)}>
                        <FontAwesomeIcon icon={faMinusCircle}/>
                    </span>
                </td>
            </tr>
        )
    }


    render() {
        return (
            <div>
                <div id="issues" className="issues-list">
                    <table class="table table-striped">
                      <tbody>
                        {(
                            (this.state.testcase.issues || []).map(this.getIssueUrl)
                        )}
                       </tbody>
                    </table>
                </div>

                <div>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#issue-modal">
                        Add Issue
                    </button>
                </div>
                <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="issue-modal">
                    <div className="modal-dialog modal-lg" role="document">

                        <div className="modal-content">
                            <div className="modal-header">
                                <ul class="nav nav-tabs" id="issueTabs" role="tablist">
                                    <li class="nav-item">
                                        <a class="nav-link active" id="create-issue-tab" data-toggle="tab" href="#create-issue" role="tab" aria-controls="Create Issue" aria-selected="true">
                                            <h5 className="modal-title">Create Issue</h5>
                                        </a>
                                      </li>
                                      <li class="nav-item">
                                        <a class="nav-link" id="link-issue-tab" data-toggle="tab" href="#link-issue" role="tab" aria-controls="Link Issue" aria-selected="false">
                                            <h5 className="modal-title">Link Issue</h5>
                                        </a>
                                      </li>
                                </ul>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>

                            <div className="tab-content" id="issuesTabContent">
                                <div class="tab-pane fade show active" id="create-issue" role="tabpanel" aria-labelledby="create-issue-tab">
                                    <div className="modal-body">
                                        <form>

                                            <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Project</label>
                                                <div className="col-sm-9">
                                                    <Select value={{value: this.state.issue.trackerProject.id, label: this.state.issue.trackerProject.name}}
                                                            cacheOptions
                                                            onChange={this.changeTrackerProject}
                                                            options={this.mapTrackerProjectsToView(this.state.suggestedTrackerProjects)}
                                                           />
                                                </div>
                                            </div>


                                            <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Name</label>
                                                <div className="col-sm-9">
                                                    <input type="text" className="form-control" name="name" onChange={this.handleChange} value={this.state.issue.name} />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Type</label>
                                                <div className="col-sm-9">
                                                    <Select name="type" value={{label: this.state.issue.type.name, value: this.state.issue.type.value}}
                                                        onChange={this.changeIssueType}
                                                        options={this.mapIssueTypesToView(this.state.issueTypes)}
                                                       />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Priority</label>
                                                <div className="col-sm-9">
                                                    <Select name="type" value={{label: this.state.issue.priority.name, value: this.state.issue.priority.id}}
                                                        name="priority"
                                                        onChange={this.changeIssuePriority}
                                                        options={this.mapIssuePrioritiesToView(this.state.issuePriorities)}
                                                       />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Description</label>
                                                <div className="col-sm-9">
                                                <textarea rows="7" name="description" className="form-control" onChange={this.handleChange} value={this.state.issue.description} ></textarea>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" onClick={this.createIssue}>Create Issue</button>
                                    </div>

                                </div>


                                <div class="tab-pane fade" id="link-issue" role="tabpanel" aria-labelledby="link-issue-tab">
                                    <div className="modal-body">
                                        <form>
                                            <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Search</label>
                                                <div className="col-sm-9">
                                                    <AsyncSelect value={this.state.linkIssueView}
                                                            cacheOptions
                                                            loadOptions={this.suggestIssues}
                                                            onChange={this.changeLinkIssueId}
                                                            options={this.mapIssuesToView(this.state.suggestedIssues)}
                                                           />
                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" className="btn btn-primary" onClick={this.linkIssue}>Link Issue</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
      }


}

export default Issues;
