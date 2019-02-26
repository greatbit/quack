import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';
require('popper.js/dist/umd/popper.min.js');
require('bootstrap-fileinput/js/fileinput.min.js');
require('bootstrap-fileinput/css/fileinput.min.css');

class Attachments extends SubComponent {
    constructor(props) {
        super(props);
        this.state = {
             testcase: {
                 attachments: []
             },
             projectId: props.projectId,
             testcase: props.testcase
         };
         this.getAttachmentUrl = this.getAttachmentUrl.bind(this);
      }

    componentWillReceiveProps(nextProps) {
      if(nextProps.testcase){
        this.state.testcase = nextProps.testcase;
      }
      if(nextProps.projectId){
        this.state.projectId = nextProps.projectId;
      }
      this.setState(this.state);
      if (this.state.projectId && this.state.testcase.id && this.state.testcase.id != null){
          $("#file-data").fileinput({
              previewFileType:'any',
              uploadUrl: '/api/' + this.state.projectId + '/testcase/attachment/' + this.state.testcase.id
          })
      }

    }

    componentDidMount() {
        super.componentDidMount();
    }

    getAttachmentUrl(attachment){
        return (
            <div>
                <a href={'/api/' + this.state.projectId +
                    '/testcase/attachment/' + this.state.testcase.id + '/' +
                    attachment.id} target='_blank'>{attachment.title}</a>
            </div>
        )
    }


    render() {
        return (
            <div>
                <div id="files">
                {(
                    (this.state.testcase.attachments || []).map(this.getAttachmentUrl)
                )}
                </div>

                <div>
                    <form id="file-form" enctype="multipart/form-data">
                        <div class="file-loading">
                            <input id="file-data" class="file" type="file" name="file" multiple data-min-file-count="1" data-theme="fas"/>
                        </div>
                        <br/>
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button type="reset" class="btn btn-outline-secondary">Reset</button>
                    </form>
                </div>



            </div>

        );
      }


}

export default Attachments;
