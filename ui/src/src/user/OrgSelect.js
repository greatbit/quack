import React, { Component } from "react";
import { withRouter } from "react-router";
import qs from "qs";
import Backend from "../services/backend";
import { Link } from "react-router-dom";

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
        <div className="text-center">
            {this.state.session.metainfo.organizations.length == 0 && (
                <div>
                    <h1 className="h3 mb-3 font-weight-normal">
                        You are not a part of any organization
                    </h1>
                    <h1 className="h3 mb-3 font-weight-normal">
                        Ask your organization administrator to add you or <Link to={"/organizations/new"}> create a new one</Link>
                    </h1>
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
