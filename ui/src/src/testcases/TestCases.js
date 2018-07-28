import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

class TestCases extends Component {
    state = {
        testcases: []
    };

    componentDidMount() {
        axios
          .get("/api/testcase/" + this.props.project)
          .then(response => {

            const testcases = response.data.map(testcase => {
              return {
                id: testcase.id,
                name: testcase.name,
                attributes: testcase.attributes
              };
            });

            const newState = Object.assign({}, this.state, {
              testcases: testcases
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }


    render() {
        return (
          <div>
            <ul>{
                this.state.testcases.map(function(testcase){
                    return <li><Link to={"/testcase/" + this.props.project + "/" + testcase.id}>{testcase.name}</Link></li>;
                })
            }</ul>
          </div>
        );
      }

}

export default TestCases;
