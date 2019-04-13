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
            type: "BUG",
            description: "",
            priority: "NORMAL",
            issueProject: {}
        }

        this.state = {
             projectId: props.projectId,
             testcase: props.testcase || {issues: []},
             issue: Object.assign({}, this.defaultIssue),
             linkIssueView: {},
             suggestIssues: [],
             suggestIssueProjects: []
         };

         this.types = [{value: "BUG", label: "BUG"}, {value: "TASK", label: "TASK" },
                        {value: "FEATURE", label: "FEATURE"}, {value: "AUTOMATION", label: "AUTOMATION"}];
         this.priorities = [{value: "BLOCKER", label: "BLOCKER"}, {value: "CRITICAL", label: "CRITICAL"},
                            {value: "NORMAL", label: "NORMAL"}, {value: "MINOR", label: "MINOR"},
                            {value: "TRIVIAL", label: "TRIVIAL"}];

         this.unlinkIssue = this.unlinkIssue.bind(this);
         this.getIssueUrl = this.getIssueUrl.bind(this);
         this.createIssue = this.createIssue.bind(this);
         this.handleChange = this.handleChange.bind(this);
         this.handleSelectChange = this.handleSelectChange.bind(this);
         this.changeLinkIssueId = this.changeLinkIssueId.bind(this);
         this.suggestIssues = this.suggestIssues.bind(this);
         this.suggestProjects = this.suggestProjects.bind(this);
         this.linkIssue = this.linkIssue.bind(this);
         this.changeIssueProject= this.changeIssueProject.bind(this);
      }

    componentWillReceiveProps(nextProps) {
      if(nextProps.testcase){
        this.state.testcase = nextProps.testcase;
      }
      if(nextProps.projectId){
        this.state.projectId = nextProps.projectId;
      }
      this.setState(this.state);
    }

    componentDidMount(){
        super.componentDidMount();
        this.onTestcaseUpdated = this.props.onTestcaseUpdated;

        axios.get('/api/' + this.state.projectId + '/testcase/issue/projects')
            .then(response => {
                 this.state.suggestedIssueProjects = response.data;
                 this.setState(this.state);
        })
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
                 this.state.suggestedIssueProjects = response.data;
                 this.setState(this.state);
                 callback(this.mapIssueProjectsToView(this.state.suggestedIssueProjects));
        })
    }

    changeLinkIssueId(value){
        this.state.linkIssueView = value;
        this.setState(this.state);
    }

    changeIssueProject(value){
        this.state.issue.issueProject = {name: value.label, id: value.value};
        this.setState(this.state);
    }


    mapIssuesToView(issues){
        return (issues || []).map(function(issue){return {value: issue.id, label: issue.name}});
    }

    mapIssueProjectsToView(issueProjects){
        return (issueProjects || []).map(function(issueProject){return {value: issueProject.id, label: issueProject.name}});
    }

    getIssueUrl(issue){
        return (
            <tr>
                <td>
                    <a href={issue.url || ""} target='_blank'>{issue.name}</a>
                </td>
                <td>
                    {issue.type}
                </td>
                <td>
                    {issue.priority}
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
                                                    <Select value={{value: this.state.issue.issueProject.id, label: this.state.issue.issueProject.name}}
                                                            cacheOptions
                                                            onChange={this.changeIssueProject}
                                                            options={this.mapIssueProjectsToView(this.state.suggestedIssueProjects)}
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
                                                    <Select name="type" value={{label: this.state.issue.type, value: this.state.issue.type}}
                                                        onChange={this.handleSelectChange}
                                                        options={this.types}
                                                       />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-sm-3 col-form-label">Priority</label>
                                                <div className="col-sm-9">
                                                    <Select name="type" value={{label: this.state.issue.priority, value: this.state.issue.priority}}
                                                        name="priority"
                                                        onChange={this.handleSelectChange}
                                                        options={this.priorities}
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
