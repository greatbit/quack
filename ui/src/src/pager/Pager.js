import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class Pager extends Component {
    constructor(props) {
        super(props);
        this.state = {
             totalItems: this.props.totalItems,
             currentPage: this.props.currentPage,
             visiblePages: this.props.visiblePages,
             itemsOnPage: this.props.itemsOnPage,
             pageObjects: []
         };
         this.onPageChanged = this.props.onPageChanged;

    }

    componentDidMount() {
        this.state.pageObjects = this.getPageObjects();
        this.setState(this.state);
    }

    componentWillReceiveProps(props) {
        this.state.totalItems = props.totalItems;
        this.state.currentPage = props.currentPage;
        this.state.pageObjects = this.getPageObjects();
        this.setState(this.state);
    }


    getPageObjects(){
        var totalPages = (this.state.totalItems - this.state.totalItems % this.state.itemsOnPage) / this.state.itemsOnPage;
        if (this.state.totalItems / this.state.itemsOnPage - totalPages > 0){
            totalPages++;
        }

        var startFromPage = Math.max(0, this.state.currentPage - this.state.itemsOnPage / 2)
        var endPage = Math.min(totalPages - 1, this.state.currentPage + this.state.itemsOnPage / 2 + 1)

        var result = [];
        result.push({title: '<', index: Math.max(this.state.currentPage - 1, 0), enabled: this.state.currentPage != 0});

        var startPageTitle = startFromPage + 1;
        if (startFromPage != 0){
            startPageTitle = '...'
        }
        result.push({title: startPageTitle, index: startFromPage, enabled: startFromPage != this.state.currentPage});
        for (var i = startFromPage + 1; i < endPage; i++){
            var title = i + 1;
            result.push({title: title, index: i, enabled: i != this.state.currentPage});
        }
        var endPageTitle = endPage + 1;
        if (endPage != totalPages){
            endPageTitle = '...'
        }

        if (startFromPage != endPage){
            result.push({title: endPageTitle, index: endPage, enabled: endPage != this.state.currentPage});
        }

        result.push({title: '>', index: Math.min(this.state.currentPage + 1, totalPages - 1), enabled: this.state.currentPage != totalPages - 1});

        return result;

    }



    render() {
        var pages = this.getPageObjects();
        return (
            <div>
                <nav>
                  <ul class="pagination">
                      {
                          this.state.pageObjects.map(function(page){
                              var disabledClass = page.enabled ? '' : 'disabled';
                              var styleClass = 'page-item ' + disabledClass;
                              return (
                                <li class={styleClass}>
                                    <a class="page-link" href="#" index={page.index} onClick={(e) => this.onPageChanged(page.index, e)}>
                                        {page.title}
                                    </a>
                                </li>
                              );
                          }.bind(this))
                      }
                  </ul>
                </nav>
            </div>
        );

      }

}

export default Pager;
