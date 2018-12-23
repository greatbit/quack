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
             itemsOnPage: this.props.itemsOnPage
         };

      }

    componentDidMount() {

    }

    getPageObjects(){
        var totalPages = this.state.totalItems / this.state.itemsOnPage;
        if (this.state.totalItems % this.state.itemsOnPage > 0){
            totalPages++;
        }

        var result = [];
        result.push({title: '<', index: -2, enabled: this.state.current != 0});

        var startFromPage = Math.max(0, this.state.currentPage - this.state.itemsOnPage/2)
        var endPage = Math.min(totalPages, this.state.currentPage + this.state.itemsOnPage/2 + 1)

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
        result.push({title: endPageTitle, index: endPage, enabled: endPage != this.state.currentPage});

        result.push({title: '>', index: -1, enabled: this.state.current != totalPages});

        console.log(result);

        return result;

    }



    render() {
        var pages = this.getPageObjects();
        return (
            <div>
                <nav>
                  <ul class="pagination">
                    <li class="page-item disabled">
                      <span class="page-link">Previous</span>
                    </li>
                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item active">
                      <span class="page-link">
                        2
                        <span class="sr-only">(current)</span>
                      </span>
                    </li>
                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                    <li class="page-item">
                      <a class="page-link" href="#">Next</a>
                    </li>
                  </ul>
                </nav>
            </div>
        );

      }

}

export default Pager;
