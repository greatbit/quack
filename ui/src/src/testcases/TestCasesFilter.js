import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import Select from 'react-select';
import queryString from 'query-string';

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
        this.handleFilter = this.handleFilter.bind(this);
        this.getFilterQParams = this.getFilterQParams.bind(this);
        this.getGroupingQParams = this.getGroupingQParams.bind(this);
        this.getQueryParams = this.getQueryParams.bind(this);
        this.getAttributeName = this.getAttributeName.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.projectAttributes){
        this.state.projectAttributes = nextProps.projectAttributes;
        this.state.filter.filters.forEach(function(filter){
            filter.name = this.getAttributeName(filter.id);
        }.bind(this))

        this.state.groupsToDisplay.forEach(function(groupToDisplay){
            groupToDisplay.label = this.getAttributeName(groupToDisplay.value);
        }.bind(this))
      }
      this.setState(this.state);
    }

    componentDidMount(){
        var params = queryString.parse(this.props.location.search);
        if (params.group){
            if(!Array.isArray(params.group)){
                params.group = [params.group];
            }
            this.state.filter.groups = params.group;
            this.state.groupsToDisplay = params.group.map(function(attrId){
                return {value: attrId, label:this.getAttributeName(attrId)};
            }.bind(this))
        }
        if (params.attribute){
            if(!Array.isArray(params.attribute)){
                params.attribute = [params.attribute];
            }
            var map = {}
            params.attribute.forEach(function(pair){
                var key = pair.split(":")[0];
                var value = pair.split(":")[1];
                if (!map[key]){
                    map[key] = [];
                }
                map[key].push(value);
            })

            Object.keys(map).forEach(function(key) {
                this.state.filter.filters.push({
                    id: key,
                    values: map[key],
                    title: this.getAttributeName(key)

                });
            }.bind(this))

            if (!this.state.filter.filters[0].id){
                var emptyFilter = this.state.filter.filters[0];
                this.state.filter.filters.push(emptyFilter);
                this.state.filter.filters.shift();
            }

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

    handleFilter(){
        this.props.history.push("/" + this.props.project + '/testcases?' + this.getQueryParams());
    }

    getQueryParams(){
        return [this.getFilterQParams(), this.getGroupingQParams()].
                       filter(function(val){return val !== ""}).join("&");
    }

    getFilterQParams(){
        var activeFilters = this.state.filter.filters.filter(function(filter){return filter.id}) || [];
        var attributesPairs = [];
        activeFilters.forEach(function(filter){
            var tokens = filter.values.map(function(value){
                return "attribute=" + filter.id + ":" + value
            })
            attributesPairs = attributesPairs.concat(tokens);
        })

        return attributesPairs.join("&") || "";
    }

    getGroupingQParams(){
        return this.state.filter.groups.map(function(group){return "group=" + group}).join("&") || "";
    }


    getAttributeName(id){
        return (this.state.projectAttributes.find(function(attribute){return attribute.id === id}) || {values: []}).name;
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
                <button type="button" className="btn btn-primary" onClick={this.handleFilter}>Filter</button>
            </div>
        );
      }


}

export default withRouter(TestCasesFilter);
