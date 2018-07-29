import React, { Component } from 'react';

class SubComponent extends Component {
    componentDidMount(){
        this.props.onProjectChange(this.props.match.params.project);
    }
}

export default SubComponent;
