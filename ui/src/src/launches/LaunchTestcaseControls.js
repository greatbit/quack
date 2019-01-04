import React, { Component } from 'react';
import axios from "axios";

class LaunchTestcaseControls extends Component {

    state = {

    };

    constructor(props) {
        super(props);
        this.state.testcase = this.props.testcase;
        this.state.launchId = this.props.launchId;
        this.state.projectId = this.props.projectId;
    }

    componentDidMount() {
        this.callback = this.props.callback || function(testcase){}
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.testcase) {
          this.state.testcase = nextProps.testcase;
      }
      if (nextProps.launchId) {
          this.state.launchId = nextProps.launchId;
      }
      this.setState(this.state);
    }

    handleStatusSubmit(status, event){
        axios.post('/api/' + this.state.projectId + '/launch/' + this.state.launchId + '/' + this.state.testcase.uuid + '/status/' + status)
            .then(response => {
                this.state.testcase = response.data;
                this.setState(this.state);
                this.callback(this.state.testcase);

        })
        event.preventDefault();

    }

    renderRunnable(){
        return <button type="button" class="btn btn-success" onClick={(e) => this.handleStatusSubmit("RUNNING", e)}>Start</button>
    }

    renderRunning(){
        return(
            <div>
                <button type="button" class="btn btn-success" onClick={(e) => this.handleStatusSubmit("PASSED", e)}>Pass</button>
                <button type="button" class="btn btn-danger" onClick={(e) => this.handleStatusSubmit("FAILED", e)}>Fail</button>
                <button type="button" class="btn btn-warning" onClick={(e) => this.handleStatusSubmit("BROKEN", e)}>Broken</button>
                <button type="button" class="btn btn-secondary" onClick={(e) => this.handleStatusSubmit("SKIPPED", e)}>Skip</button>
            </div>
        )
    }

    renderFinished(){
        return <button type="button" class="btn btn-warning" onClick={(e) => this.handleStatusSubmit("RUNNABLE", e)}>X</button>
    }

    renderButtons(){
        if (this.state.testcase.launchStatus == 'RUNNABLE'){
            return this.renderRunnable();
        } else if (this.state.testcase.launchStatus == 'RUNNING'){
            return this.renderRunning();
        } else {
            return this.renderFinished();
        }
    }

    render() {
        return (
          <div class="btn-group" role="group">
            {this.renderButtons()}
          </div>
        );
      }

}

export default LaunchTestcaseControls;
