import React, { Component } from 'react';
import Header from './common/Header'
import Main from './common/Main'
import Footer from './common/Footer'
import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
        return (
          <div>
            <Header />
            <Main />
            <Footer />
           </div>
        );
      }

}

export default App;
