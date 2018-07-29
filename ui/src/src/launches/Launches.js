import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'

class Launches extends SubComponent {
    render() {
        return (
          <div>
            Launches
          </div>
        );
      }

      componentDidMount() {
        super.componentDidMount();
      }

}

export default Launches;
