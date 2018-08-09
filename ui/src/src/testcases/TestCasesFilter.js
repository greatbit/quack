import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import Select from 'react-select';

class TestCasesFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
             filter: {
                 groups: [],
                 filter: []
             },
             groupsToDisplay: [],
             projectAttributes: []
         };

        this.changeGrouping = this.changeGrouping.bind(this);

    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.projectAttributes){
        this.state.projectAttributes = nextProps.projectAttributes;
      }
      this.setState(this.state);
    }

    changeGrouping(values){
        this.state.filter.groups = values.map(function(value){return value.value});
        this.state.groupsToDisplay = values;

        console.log(this.state.groupsToDisplay);

        this.setState(this.state);
    }


    render() {
        return (
            <div>
                <div>Grouping</div>
                <div>
                    <Select value={this.state.groupsToDisplay}
                            isMulti
                            onChange={this.changeGrouping}
                            options={this.state.projectAttributes.map(function(val){return {value: val.id, label: val.name}})}
                           />
                </div>
            </div>
        );
      }


}

export default withRouter(TestCasesFilter);
