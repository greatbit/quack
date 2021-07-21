/* eslint-disable jsx-a11y/anchor-is-valid */
import SubComponent from "../SubComponent";
import React from "react";

export class ConfirmButton extends SubComponent {
  constructor(props) {
    super(props);
    this.state = {
      onSubmit: props.onSubmit,
      buttonClass: props.buttonClass,
      id: props.id,
      modalText: props.modalText,
      buttonText: props.buttonText,
      componentId: props.id + "-" + Math.floor(Math.random() * 100),
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.setState(this.state);
  }

  handleSubmit(event) {
    console.log(this);
    if (this.state.onSubmit) {
      this.state.onSubmit(event, this.state.id);
    }
  }

  render() {
    return (
      <div>
        <a
          type="button"
          className={this.state.buttonClass}
          data-toggle="modal"
          data-target={"#confirmation-" + this.state.componentId}
        >
          {this.state.buttonText}
        </a>
        <div className="modal fade" tabIndex="-1" role="dialog" id={"confirmation-" + this.state.componentId}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{this.state.modalText}</div>
              <div className="modal-footer">
                <a
                  type="button"
                  className={this.state.buttonClass}
                  data-dismiss="modal"
                  onClick={e => this.handleSubmit(e)}
                >
                  {this.state.buttonText}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
