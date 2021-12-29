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
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleAdminsChange = this.handleAdminsChange.bind(this);
    this.handleUsersChange = this.handleUsersChange.bind(this);
    this.handleAdminAdded = this.handleAdminAdded.bind(this);
    this.handleUserAdded = this.handleUserAdded.bind(this);
    this.handleAdminAdded = this.handleAdminAdded.bind(this);
    this.handleAdminDeleted = this.handleAdminDeleted.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);

  }

  componentDidMount() {
    if (this.props.editCurrent) {
        Backend.get("user/session")
          .then(response => {
            this.currentLogin = response.login;
            if ((response.metainfo || {}).organizationsEnabled){
                Backend.get("organization/" + response.metainfo.currentOrganization).then(response => {
                    this.state.organization = response;
                    this.state.readonly = !(this.state.organization.admins||[]).includes(this.currentLogin );
                    this.setState(this.state);
                }).catch((e) => {
                    console.log("Unable to fetch organization");
                }).bind(this);
            }
          })
          .catch((e) => {
            console.log("Unable to fetch session");
          });
    } else {
        Backend.get("user/session")
          .then(response => {
            this.currentLogin = response.login;
            this.state.organization.admins.push(response.login);
            this.setState(this.state);
          })
          .catch((e) => {
            console.log("Unable to fetch session");
          });
    }

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

  handleCreate(event) {
    Backend.post("organization", this.state.organization)
      .then(response => {
        this.props.history.push("/organizations/" + response.id);
      })
      .catch(error => {
        Utils.onErrorMessage("Couldn't create organization: ", error);
      });
    event.preventDefault();
  }

  handleUpdate(event) {
      Backend.put("organization", this.state.organization)
        .then(response => {
          this.props.history.push("/organizations/" + response.id);
        })
        .catch(error => {
          Utils.onErrorMessage("Couldn't update organization: ", error);
        });
      event.preventDefault();
    }

  normalizeId(id) {
    return id
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "");
  }

  render() {
    return (
      <div className='org-form'>
        {this.props.editCurrent &&
              (
              <div>
                <h1>Update Organization</h1>
                <div>
                    <b>{this.state.organization.licenseCapacity}</b> parallel user sessions are currently available for organization.
                    <br/>
                    Please <a href="https://www.testquack.com/#contacts" target="_blanc">contact us</a> to purchase more.
                </div>
              </div>
              )
        }
        {!this.props.editCurrent &&
              (
                <h1>Create Organization</h1>
              )
        }

        <form>
          <div className="org-form-block">
              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Name</label>
                <div className="col-sm-9">
                  {!this.state.readonly &&
                    <input type="text" name="name" value={this.state.organization.name} onChange={this.handleChange} className="form-control"/>
                  }
                  {this.state.readonly &&
                    <input type="text" name="name" value={this.state.organization.name} onChange={this.handleChange} className="form-control" disabled/>
                  }
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Organization ID</label>
                <div className="col-sm-9">
                {!this.props.editCurrent &&
                  <input type="text" name="id" value={this.state.organization.id || ""} onChange={this.handleChange} className="form-control"/>
                }
                {this.props.editCurrent &&
                  <input type="text" name="id" value={this.state.organization.id || ""} onChange={this.handleChange} disabled className="form-control"/>
                }
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-3 col-form-label">Description</label>
                <div className="col-sm-9">
                {this.state.readonly &&
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={this.state.organization.description}
                    onChange={this.handleChange}
                    disabled
                  />
                }
                {!this.state.readonly &&
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={this.state.organization.description}
                    onChange={this.handleChange}
                  />
                }
                </div>
              </div>
          </div>
          <div className="org-form-block">
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
                    {!this.state.readonly && this.currentLogin !== admin && (
                        <span className="clickable edit-icon-visible red" onClick={e => this.handleAdminDeleted(index, e)}>
                          <FontAwesomeIcon icon={faMinusCircle} />
                        </span>
                    )}
                  </div>
                );
            }.bind(this))}
            {!this.state.readonly && (
                <div className="row org-users-form">
                    <div className="col-sm-8">
                        <input type="text" name="administrators" className="form-control" value={this.state.administratorsEdit} onChange={this.handleAdminsChange}/>
                    </div>
                    <div className="col-sm-4">
                        <button type="button" className="btn btn-primary" onClick={this.handleAdminAdded}> Add Administrator </button>
                    </div>
                </div>
            )}
          </div>


          <div className="org-form-block">
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
            {!this.state.readonly && (
                <div className="row org-users-form">
                    <div className="col-sm-8">
                        <input type="text" name="users" className="form-control" value={this.state.usersEdit} onChange={this.handleUsersChange}/>
                    </div>
                    <div className="col-sm-4">
                        <button type="button" className="btn btn-primary" onClick={this.handleUserAdded}>Add User</button>
                    </div>
                </div>
            )}
          </div>

          <div className="org-form-block">
          {this.props.editCurrent && !this.state.readonly &&
            (
              <button type="button" className="btn btn-primary" onClick={this.handleUpdate}>
                  Update
               </button>
            )
          }
          {!this.props.editCurrent &&
              (
                <button type="button" className="btn btn-primary" onClick={this.handleCreate}>
                    Create
                 </button>
              )
           }
        </div>
        </form>
      </div>
    );
  }
}

export default withRouter(OrganizationForm);
