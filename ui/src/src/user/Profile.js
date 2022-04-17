import React from "react";
import { withRouter } from "react-router";
import SubComponent from "../common/SubComponent";
import { Link } from "react-router-dom";
import * as Utils from "../common/Utils";
import Backend from "../services/backend";
class Profile extends SubComponent {
  state = {
    profile: {},
    session: {person:{}}
  };

  constructor(props) {
    super(props);
    this.getUser = this.getUser.bind(this);
    this.getSession = this.getSession.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.state.profile.id = this.props.match.params.profileId;
    this.getSession();
    this.getUser();
  }

  getUser() {
    Backend.get("user/" + this.state.profile.id)
      .then(response => {
        this.state.profile = response;
        this.setState(this.state);
      })
      .catch(error => {
        Utils.onErrorMessage("Couldn't get user: ", error);
      });
  }

  getSession() {
    Backend.get("user/session")
          .then(response => {
                this.state.session = response;
          })
          .catch(() => {
            console.log("Unable to fetch session");
          });
  }

  render() {
    return (
      <div>
        <h1>
          {this.state.profile.firstName} {this.state.profile.lastName}{" "}
          <span className="text-muted">({this.state.profile.login})</span>{" "}
        </h1>
        {!this.state.session.metainfo || !this.state.session.metainfo.organizationsEnabled && (

            <div>
              <div className="row">
                <div className="col-12">
                  <Link to={"/user/change-password-redirect/" + this.state.profile.id}>Change Password</Link>
                </div>
              </div>
            </div>
        )}
      </div>
    );
  }
}

export default withRouter(Profile);
