import React, { Component } from 'react';
import Header from './common/Header'
import Main from './common/Main'
import Footer from './common/Footer'
import logo from './logo.svg';
import './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel } from '@fortawesome/free-solid-svg-icons'

library.add(faStroopwafel)

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: ""
        }
        this.onProjectChange = this.onProjectChange.bind(this);
      }


    onProjectChange(project){
        const newState = Object.assign({}, this.state, {
            project: project
        });
        this.setState(newState);
    }

    render() {
        return (
          <div className="container-fluid">
            <Header project={this.state.project} />
            <Main onProjectChange={this.onProjectChange} />
            <Footer />
           </div>
        );
      }

}

export default App;
