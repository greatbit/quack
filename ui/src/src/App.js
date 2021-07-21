import React, { Component } from "react";
import Header from "./common/Header";
import Main from "./common/Main";
import Footer from "./common/Footer";
import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStroopwafel } from "@fortawesome/free-solid-svg-icons";

library.add(faStroopwafel);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: "",
      session: { person: { firstName: "Guest" } },
    };
    this.onProjectChange = this.onProjectChange.bind(this);
    this.onSessionChange = this.onSessionChange.bind(this);
  }

  onProjectChange(project) {
    const newState = Object.assign({}, this.state, {
      project: project,
    });
    this.setState(newState);
  }

  onSessionChange(session) {
    const newState = Object.assign({}, this.state, {
      session: session,
    });
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <Header project={this.state.project} session={this.state.session} onSessionChange={this.onSessionChange} />
        <div className="container-fluid">
          <Main
            onProjectChange={this.onProjectChange}
            session={this.state.session}
            onSessionChange={this.onSessionChange}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
