import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import queryString from 'query-string';
import Pager from '../pager/Pager';

class Launches extends SubComponent {

    state = {
        launches: [],
        filter: {
            skip: 0,
            limit: 20
        },
        pager: {
            total: 0,
            current: 0,
            visiblePage: 7,
            maxVisiblePage: 0,
            itemsOnPage: 20
        }
    };

    constructor(props) {
        super(props);
        this.queryToFilter = this.queryToFilter.bind(this);
        this.filterToQuery = this.filterToQuery.bind(this);
        this.getLaunches = this.getLaunches.bind(this);
        this.getPager = this.getPager.bind(this);
        this.handlePageChanged = this.handlePageChanged.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.queryToFilter();
        this.getLaunches();
        this.getPager();
    }

    handlePageChanged(newPage) {
        this.state.pager.current = newPage;
        this.state.filter.skip = newPage * this.state.pager.itemsOnPage;
        this.getLaunches();
        this.setState(this.state);
    }

    getLaunches(){
        axios
            .get("/api/" + this.props.match.params.project + "/launch?" + this.filterToQuery(this.state.filter))
            .then(response => {
                 this.state.launches = response.data;
                 this.setState(this.state);
        })
            .catch(error => console.log(error));
    }

    getPager(){
        var countFilter = Object.assign({skip:0, limit:0}, this.state.filter);
        axios
            .get("/api/" + this.props.match.params.project + "/launch/count?" + this.filterToQuery(countFilter))
            .then(response => {
                 this.state.pager.total = response.data;
                 this.state.pager.total.current = this.state.filter.skip / this.state.filter.limit;
                 this.state.pager.visiblePage = Math.min(response.data / 20 + 1, this.state.pager.maxVisiblePage);
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

    filterToQuery(filter){
        return Object.keys(filter).
                    map((key) => {return key + "=" + filter[key]}).join("&");
    }

    render() {
        return (
          <div>
              <div>{
                    this.state.launches.map(function(launch){
                        return (<div><Link to={'/' + this.props.match.params.project + '/launches/' + launch.id}>
                                        {launch.name}
                                    </Link>
                               </div>);
                    }.bind(this))
              }</div>

              <div>
                  <Pager
                      totalItems={this.state.pager.total}
                      currentPage={this.state.pager.current}
                      visiblePages={this.state.pager.visiblePage}
                      itemsOnPage={this.state.pager.itemsOnPage}
                      onPageChanged={this.handlePageChanged}
                  />
              </div>
          </div>
        );
      }

}

export default Launches;
