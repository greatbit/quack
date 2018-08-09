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
                 filters: [{
                    title: "Select an attribute",
                    values: []
                 }]
             },
             groupsToDisplay: [],
             projectAttributes: []
         };

        this.changeGrouping = this.changeGrouping.bind(this);
        this.getValuesByAttributeId = this.getValuesByAttributeId.bind(this);
        this.changeFilterAttributeId = this.changeFilterAttributeId.bind(this);
        this.changeFilterAttributeValues = this.changeFilterAttributeValues.bind(this);

    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.projectAttributes){
        this.state.projectAttributes = nextProps.projectAttributes;
      }
      this.setState(this.state);
    }

    changeFilterAttributeId(index, value){
        var oldId = this.state.filter.filters[index].id;
        this.state.filter.filters[index].id = value.value;
        this.state.filter.filters[index].name = value.label;
        if (oldId !== value.value){
            this.state.filter.filters[index].values = [];
        }
        if (!oldId){
            this.state.filter.filters.push({
                id: null,
                title: "Select an attribute",
                values: []
            })
        }

        this.setState(this.state);
    }

    changeFilterAttributeValues(index, values){
        this.state.filter.filters[index].values = values.map(function(value){return value.value});
        this.setState(this.state);
    }

    changeGrouping(values){
        this.state.filter.groups = values.map(function(value){return value.value});
        this.state.groupsToDisplay = values;
        this.setState(this.state);
    }

    getValuesByAttributeId(id){
        if(!id) return [];
        return (this.state.projectAttributes.find(function(attribute){return attribute.id === id}) || {values: []}).values;
    }


    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-1">Grouping</div>
                    <div className="col-3">
                        <Select value={this.state.groupsToDisplay}
                                isMulti
                                onChange={this.changeGrouping}
                                options={this.state.projectAttributes.map(function(val){return {value: val.id, label: val.name}})}
                               />
                    </div>
                </div>
                <div className="row">
                    <div className="col-1">Filter</div>
                        {
                            this.state.filter.filters.map(function(filter, i){
                                return(
                                <div className="col-5">
                                    <div className="row">
                                        <Select className="col-5 filter-attribute-id-select" value={{value: filter.id, label: filter.name}}
                                                onChange={(e) => this.changeFilterAttributeId(i, e)}
                                                options={this.state.projectAttributes.map(function(val){return {value: val.id, label: val.name}})}
                                               />
                                        <Select className="col-7 filter-attribute-val-select" value={filter.values.map(function(value){return {value: value, label: value}})}
                                                isMulti
                                                onChange={(e) => this.changeFilterAttributeValues(i, e)}
                                                options={this.getValuesByAttributeId(filter.id).map(function(val){return {value: val, label: val}})}
                                               />
                                    </div>
                                </div>
                                )
                            }.bind(this))

                        }




                </div>
            </div>
        );
      }


}

export default withRouter(TestCasesFilter);
