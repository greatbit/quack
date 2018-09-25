import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import queryString from 'query-string';

class Launches extends SubComponent {

    state = {
        launches: [],
        filter: {}
    };

    constructor(props) {
        super(props);
        this.queryToFilter = this.queryToFilter.bind(this);
        this.filterToQuery = this.filterToQuery.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.queryToFilter();
        axios
            .get("/api/" + this.props.match.params.project + "/launch?" + this.filterToQuery())
            .then(response => {
                 this.state.launches = response.data;
                 this.setState(this.state);
        })
            .catch(error => console.log(error));
    }

    queryToFilter(){
        var params = queryString.parse(this.props.location.search);
        this.state.filter.skip = params.skip || 0;
        this.state.filter.limit = params.limit || 20;
        this.setState(this.state);
    }

    filterToQuery(){
        return Object.keys(this.state.filter).
                    map((key) => {return key + "=" + this.state.filter[key]}).join("&");
    }

    render() {
        return (
          <div>{
            this.state.launches.map(function(launch){
                return (<div><Link to={'/' + this.props.match.params.project + '/launches/' + launch.id}>
                                {launch.name}
                            </Link>
                       </div>);
            }.bind(this))
          }</div>
        );
      }

}

export default Launches;
