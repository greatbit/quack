import React, { Component } from "react";
import Header from "./common/Header";
import Main from "./common/Main";
import Footer from "./common/Footer";
import "./css/App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStroopwafel } from "@fortawesome/free-solid-svg-icons";
import "jquery-slidePanel/dist/jquery-slidePanel.min.js";


// import  "./assets/js/Global/GlobalMenuComponent.js"
// import  "./assets/js/Global/Component.js"
// import UIComponent from "./assets/js/Global/Component.js"
// require("./assets/js/Global/UIComponent.js")
// require("./assets/js/Global/Plugin.js")
// require("./assets/js/Global/Base.js")
// require("./assets/js/Global/Config.js")
// import "./assets/js/Global/Plugin.js"
// import "./assets/js/Global/Base.js"
//import "./assets/js/Global/Config.js"
//
//import "./assets/js/Section/Menubar.js"
//import "./assets/js/Section/Sidebar.js"
//import "./assets/js/Section/PageAside.js"
//import "./assets/js/Section/GridMenu.js"

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
