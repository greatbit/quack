import React, { Component } from "react";
import { withRouter } from "react-router";
import qs from "qs";
import Backend from "../services/backend";
class OrgSelect extends Component {

    constructor(props) {
      super(props);
       this.state = {
          session: {metainfo:{organizations:[]}}
        };
    }

    componentDidMount() {
        Backend.get("user/session")
          .then(response => {
            this.state.session = response;
            this.state.session.metainfo = this.state.session.metainfo || {};
            this.state.session.metainfo.organizations = this.state.session.metainfo.organizations || [];
            if (this.state.session.metainfo.currentOrganization){
                window.location = "/";
            }
            this.setState(this.state);
          })
          .catch(error => {
            console.log("Org Select ERROR");
            console.log(error);
            window.location = "/auth";
          });
    }

    render() {
      return (
        <div>
            {this.state.session.metainfo.organizations.length == 0 && (
                <div>
                    You are not a part of any organization.
                    Ask your organization administrator to add you or create a new one.
                </div>
            )}
            {this.state.session.metainfo.organizations.length > 1 && (
                <div>
                    Display organization list here
                </div>
            )}
        </div>
      );
    }
}

export default withRouter(OrgSelect);
