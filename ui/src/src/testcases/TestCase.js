import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';

class TestCase extends Component {
    constructor(props) {
        super(props);
        this.state = {
             testcase: {
                 id: null,
                 name: "",
                 description: "",
                 steps: [],
                 attributes: []
             }
         };
      }

    componentDidMount() {
        axios
          .get("/api/"  + this.props.match.params.project + "/testcase/"+ this.props.match.params.testcase )
          .then(response => {
            const newState = Object.assign({}, this.state, {
                testcase: response.data
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }


    render() {
        return (
            <div onSubmit={this.handleSubmit}>
              <span>
                Name: {this.state.testcase.name}
              </span>
              <span>
                Description: {this.state.testcase.description}
              </span>
            </div>
        );
      }

}

export default TestCase;
