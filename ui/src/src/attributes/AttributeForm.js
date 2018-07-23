import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';

class AttributeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
             attribute: {
                 id: null,
                 name: "",
                 values: []
             }
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
        axios.post('/api/attribute/' + this.props.project, this.state.attribute)
        .then(response => {
            //ToDo: close modal
        })
        event.preventDefault();
      }

    componentDidMount() {
        if (this.props.id){
            axios
              .get("/api/project/" + this.props.project)
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
