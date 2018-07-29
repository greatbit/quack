import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'

class TestSuites extends SubComponent {
    render() {
        return (
          <div>
            Suites
          </div>
        );
      }

      componentDidMount() {
        super.componentDidMount();
      }

}

export default TestSuites;
