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
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addValue = this.addValue.bind(this);
        this.removeValue = this.removeValue.bind(this);
      }

      componentWillReceiveProps(nextProps) {
        this.setState({ attribute: nextProps.attribute });
      }

      handleChange(event) {
        this.state.attribute[event.target.name] = event.target.value;
        this.setState(this.state);
      }

      handleValueChange(i, event) {
        this.state.attribute.values[i] = event.target.value;
        this.setState(this.state);
       }

      removeValue(i, event){
        this.state.attribute.values.splice(i, 1);
        this.setState(this.state);
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

      addValue(event){
        this.state.attribute.values.push("");
        this.setState(this.state);
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
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="editAttributeLabel">Attribute</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <label>
                        Name:
                        <input type="text" name="name" value={this.state.attribute.name} onChange={this.handleChange} />
                      </label>

                      {this.state.attribute.values.map((value, i) => {
                         return(
                             <div>
                                 <label>
                                     Values:
                                     <input type="text" name="value" index={i} value={value}
                                            onChange={(e) => this.handleValueChange(i, e)} />
                                 </label>
                                 <span index={i} onClick={(e) => this.removeValue(i, e)}>X</span>
                             </div>
                         )
                      })}

                      <button type="button" className="btn" onClick={this.addValue}>Add value</button>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Save changes</button>
                  </div>
                </div>
             </div>
        );
      }

}

export default AttributeForm;
