import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'

class Attachments extends SubComponent {
    constructor(props) {
        super(props);
        this.state = {
             testcase: {
                 attachments: []
             },
             projectId: props.projectId

         };
      }

    componentWillReceiveProps(nextProps) {
      if(nextProps.testcase){
        this.state.testcase = nextProps.testcase;
      }
      if(nextProps.projectId){
          this.state.projectId = nextProps.projectId;
        }
      this.setState(this.state);
    }

    componentDidMount() {
        super.componentDidMount();
     }


    render() {
        return (
            <div>
                <div id="files">
                {(
                    (this.state.testcase.attachments || []).map(function(attachment){
                        return (

                            <div>
                                <a href="/api/">attachment.name</a>
                            </div>

                        )
                    })
                )}
                </div>

                <div id="form">
                </div>

            </div>
        );
      }


}

export default Attachments;
