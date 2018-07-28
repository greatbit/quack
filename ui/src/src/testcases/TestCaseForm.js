import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';

class TestCaseForm extends Component {
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

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) {
        var testcaseUpd = this.state.testcase;
        testcaseUpd[event.target.name] = event.target.value;
        const newState = Object.assign({}, this.state, {
          testcase: testcaseUpd
        });
        this.setState(newState);
      }

      handleSubmit(event) {
        axios.post('/api/' + this.props.match.params.project + '/testcase/', this.state.testcase)
        .then(response => {
            this.props.history.push("/" + this.props.match.params.project + '/testcases/' + response.data.id);
        })
        event.preventDefault();
      }

    componentDidMount() {
        if (this.props.id){
            axios
              .get("/api/"  + this.props.match.params.project + "/testcase/"+ this.props.id)
              .then(response => {
                const newState = Object.assign({}, this.state, {
                    testcase: response.data
                });
                this.setState(newState);
              })
              .catch(error => console.log(error));
        }
     }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={this.state.testcase.name} onChange={this.handleChange} />
              </label>
              <label>
                Description:
                <input type="text" name="description" value={this.state.testcase.description} onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
        );
      }

}

export default withRouter(TestCaseForm);
