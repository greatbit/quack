import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import axios from "axios";
import AttributeForm from '../attributes/AttributeForm'

class Attributes extends SubComponent {
    state = {
        attributes: []
    };

    componentDidMount() {
        super.componentDidMount();
        axios
          .get("/api/" + this.props.match.params.project +  "/attribute")
          .then(response => {
            const newState = Object.assign({}, this.state, {
              attributes: response.data
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }


    render() {
        return (
          <div>
            <ul>{
                this.state.attributes.map(function(attribute){
                    return <li>{attribute.name}</li>;
                })
            }</ul>
            <div>
                <AttributeForm project={this.props.match.params.project}/>
            </div>
          </div>

        );
    }

}

export default Attributes;
