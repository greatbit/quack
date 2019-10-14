import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import Pager from '../pager/Pager';
import { Link } from 'react-router-dom';
import axios from "axios";
import $ from 'jquery';
import qs from 'qs';
import * as Utils from '../common/Utils';
import { FadeLoader } from 'react-spinners';

class Events extends SubComponent {

    state = {
        events:[],
        filter: {
            skip: 0,
            limit: 20,
            orderby: "id",
            orderdir: "DESC"
        },
        pager: {
            total: 0,
            current: 0,
            maxVisiblePage: 7,
            itemsOnPage: 20
        },
        loading: true
    };

    constructor(props) {
        super(props);
        this.getEvents = this.getEvents.bind(this);
        this.getPager = this.getPager.bind(this);
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.updateUrl = this.updateUrl.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        Utils.queryToFilter(this.props.location.search.substring(1));
        this.state.entityUrl = this.props.entityUrl;
        this.state.entityName = this.props.entityName;
        this.getEvents();
        this.getPager();
     }

     getEvents(){
         axios
             .get("/api/" + this.props.match.params.project + "/audit?" + Utils.filterToQuery(this.state.filter))
             .then(response => {
                  this.state.events = response.data;
                  this.state.loading = false;
                  this.setState(this.state);
         }).catch(error => {
             Utils.onErrorMessage("Couldn't get events: ", error);
             this.state.loading = false;
             this.setState(this.state);
         });
     }

     handlePageChanged(newPage) {
         this.state.pager.current = newPage;
         this.state.filter.skip = newPage * this.state.pager.itemsOnPage;
         this.getEvents();
         this.setState(this.state);
         this.updateUrl();
     }

     getPager(){
         var countFilter = Object.assign({skip:0, limit:0}, this.state.filter);
         axios
             .get("/api/" + this.props.match.params.project + "/audit/count?" + Utils.filterToQuery(countFilter))
             .then(response => {
                  this.state.pager.total = response.data;
                  this.state.pager.current = this.state.filter.skip / this.state.filter.limit;
                  this.state.pager.visiblePage = Math.min(response.data / this.state.pager.itemsOnPage + 1, this.state.pager.maxVisiblePage);
                  this.setState(this.state);
         }).catch(error => console.log(error));
     }

    handleFilterChange(fieldName, event, index){
        if (index){
            if (event.target.value == ""){
                delete this.state.filter[fieldName][index];
            } else {
                this.state.filter[fieldName][index] = event.target.value;
            }
        } else {
            if (event.target.value == ""){
                delete this.state.filter[fieldName];
            } else {
                this.state.filter[fieldName] = event.target.value;
            }
        }
        this.setState(this.state);
    }

    onFilter(event){
        this.updateUrl();
        this.getEvents();
        this.getPager();
        event.preventDefault();
    }

    updateUrl(){
        this.props.history.push("/" + this.props.match.params.project + '/audit?' + Utils.filterToQuery(this.state.filter));
    }

    render() {
        return (
            <div className="row">
              <div className="col-sm-3 events-filter">
              </div>
              <div className="col-sm-9">
                  <div className='sweet-loading'>
                         <FadeLoader
                           sizeUnit={"px"}
                           size={100}
                           color={'#135f38'}
                           loading={this.state.loading}
                         />
                   </div>
                  <table class="table table-striped">
                      <thead>
                          <tr>
                            <th scope="col">Type</th>
                            <th scope="col">Date</th>
                            <th></th>
                          </tr>
                      </thead>
                      <tbody>
                      {
                            this.state.events.map(function(event){
                                return (
                                       <tr>
                                           <td>{event.eventType}</td>
                                           <td>{Utils.timeToDate(event.createdTime)}</td>
                                           <td>{event.user}</td>
                                       </tr>
                                       );
                            }.bind(this))
                      }
                      </tbody>
                  </table>
                  <div>
                      <Pager
                          totalItems={this.state.pager.total}
                          currentPage={this.state.pager.current}
                          visiblePages={this.state.pager.maxVisiblePage}
                          itemsOnPage={this.state.pager.itemsOnPage}
                          onPageChanged={this.handlePageChanged}
                      />
                  </div>
              </div>
            </div>

        );
      }

}

export default Events;
