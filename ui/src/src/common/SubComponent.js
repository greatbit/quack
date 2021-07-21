import { Component } from "react";

class SubComponent extends Component {
  componentDidMount() {
    if (this.props.onProjectChange) {
      this.props.onProjectChange(this.props.match.params.project);
    }
  }
}

export default SubComponent;
