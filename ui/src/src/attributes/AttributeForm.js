import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from "axios";

class AttributeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
             attribute: props.attribute
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleValuesChange = this.handleValuesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      handleChange(event) {
        var attributeUpd = this.state.attribute;
        attributeUpd[event.target.name] = event.target.value;
        const newState = Object.assign({}, this.state, {
          attribute: attributeUpd
        });
        this.setState(newState);
      }

      handleValuesChange(event) {
          var attributeUpd = this.state.attribute;
          attributeUpd.values = event.target.value.split(',');
          const newState = Object.assign({}, this.state, {
            attribute: attributeUpd
          });
          this.setState(newState);
       }

      handleSubmit(event) {
        axios.post('/api/' + this.props.project + '/attribute', this.state.attribute)
        .then(response => {
            this.props.onAttributeAdded(response.data);
            this.state.attribute = {
                id: null,
                name: "",
                values: []
            }
            this.setState(this.state);
        });
        event.preventDefault();
      }

    componentDidMount() {
        if (this.props.id){
            axios
              .get("/api/" + this.props.project + "/project")
              .then(response => {
                const newState = Object.assign({}, this.state, {
                  project: response.data
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
                <input type="text" name="name" value={this.state.attribute.name} onChange={this.handleChange} />
              </label>
              <label>
                Values:
                <input type="text" name="values" value={this.state.attribute.values} onChange={this.handleValuesChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
        );
      }

}

export default AttributeForm;
