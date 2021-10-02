import React, { Component } from "react";
import { withRouter } from "react-router";
import * as Utils from "../common/Utils";
import Backend from "../services/backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

class OrganizationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organization: {
        id: null,
        name: "",
        description: "",
        allowedGroups: [],
        allowedUsers: [],
        admins: [],
      },
      administratorsEdit: "",
      usersEdit: "",
      readonly: false // ToDo set to true if not admin and id is not null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAdminsChange = this.handleAdminsChange.bind(this);
    this.handleUsersChange = this.handleUsersChange.bind(this);
    this.handleAdminAdded = this.handleAdminAdded.bind(this);
    this.handleUserAdded = this.handleUserAdded.bind(this);
    this.handleAdminAdded = this.handleAdminAdded.bind(this);
    this.handleAdminDeleted = this.handleAdminDeleted.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);

  }

  handleAdminsChange(event) {
    this.state.administratorsEdit = event.target.value;
    this.setState(this.state);
  }

  handleAdminAdded(event) {
      if (this.state.administratorsEdit !== ""){
        this.state.organization.admins.push(this.state.administratorsEdit);
        this.state.administratorsEdit = "";
        this.setState(this.state);
      }
      event.preventDefault();
  }

  handleAdminDeleted(index, event) {
      this.state.organization.admins.splice(index, 1);
      this.setState(this.state);
  }


  handleUsersChange(event) {
    this.state.usersEdit = event.target.value;
    this.setState(this.state);
  }

  handleUserAdded(event) {
        if (this.state.usersEdit !== ""){
          this.state.organization.allowedUsers.push(this.state.usersEdit);
          this.state.usersEdit = "";
          this.setState(this.state);
        }
        event.preventDefault();
  }

  handleUserDeleted(index, event) {
      this.state.organization.allowedUsers.splice(index, 1);
      this.setState(this.state);
  }

  handleChange(event) {
    var organizationUpd = this.state.organization;
    organizationUpd[event.target.name] = event.target.value;
    // eslint-disable-next-line eqeqeq
    if (event.target.name == "name") {
      organizationUpd.id = this.normalizeId(event.target.value);
    }
    const newState = Object.assign({}, this.state, {
      organization: organizationUpd,
    });
    this.setState(newState);
  }

  handleSubmit(event) {
    Backend.post("organization", this.state.organization)
      .then(response => {
        this.props.history.push("/organizations/" + response.id);
      })
      .catch(error => {
        Utils.onErrorMessage("Couldn't save organization: ", error);
      });
    event.preventDefault();
  }

  componentDidMount() {
    if (this.props.id) {
      Backend.get("organization/" + this.props.id)
        .then(response => {
          const newState = Object.assign({}, this.state, {
            organization: response,
          });
          this.setState(newState);
        })
        .catch(error => {
          Utils.onErrorMessage("Couldn't get organization: ", error);
        });
    }
  }

  normalizeId(id) {
    return id
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "");
  }

  render() {
    return (
      <div>
        <h1>Create Organization</h1>
        <form>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input type="text" name="name" value={this.state.organization.name} onChange={this.handleChange} />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Organization ID</label>
            <div className="col-sm-10">
              <input type="text" name="id" value={this.state.organization.id || ""} onChange={this.handleChange} />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Description</label>
            <div className="col-sm-10">
              <input
                type="text"
                name="description"
                value={this.state.organization.description}
                onChange={this.handleChange}
              />
            </div>
          </div>

          <div>
            <h4> Administrators </h4>
            {this.state.organization.admins.map(function (admin, index) {
              return this.state.readonly ? (
                <div index={index}>
                  {admin}
                </div>
              ) :
              (
                  <div index={index}>
                    {admin}
                    {!this.state.readonly && (
                        <span className="clickable edit-icon-visible red" onClick={e => this.handleAdminDeleted(index, e)}>
                          <FontAwesomeIcon icon={faMinusCircle} />
                        </span>
                    )}
                  </div>
                );
            }.bind(this))}
            <input type="text" name="administrators" value={this.state.administratorsEdit} onChange={this.handleAdminsChange}/>
            <button type="button" className="btn btn-primary" onClick={this.handleAdminAdded}> Add Administrator </button>
          </div>


          <div>
            <h4> Users </h4>
            {this.state.organization.allowedUsers.map(function (user, index) {
              return this.state.readonly ? (
                <div index={index}>
                    {user}
                </div>
              ) : (
                <div index={index}>
                    {user}
                    <span className="clickable edit-icon-visible red" onClick={e => this.handleUserDeleted(index, e)}>
                        <FontAwesomeIcon icon={faMinusCircle} />
                    </span>
                </div>
              );
            }.bind(this))}
            <input type="text" name="users" value={this.state.usersEdit} onChange={this.handleUsersChange}/>
            <button type="button" className="btn btn-primary" onClick={this.handleUserAdded}>Add User</button>
          </div>

          <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>
            Create
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(OrganizationForm);
