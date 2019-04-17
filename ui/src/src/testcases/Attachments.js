import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';
import axios from "axios";
import * as Utils from '../common/Utils';
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
         this.removeAttachment = this.removeAttachment.bind(this);
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
              uploadUrl: '/api/' + this.state.projectId + '/testcase/' + this.state.testcase.id + '/attachment'
          });
          $("#file-data").on('fileuploaded', function(event, file, previewId, index) {
              this.onTestcaseUpdated();
          }.bind(this));
      }

    }

    componentDidMount(){
        super.componentDidMount();
        this.onTestcaseUpdated = this.props.onTestcaseUpdated;
    }

    removeAttachment(attachmentId){
        axios
          .delete('/api/' + this.state.projectId + '/testcase/' +  this.state.testcase.id + '/attachment/' + attachmentId)
          .then(response => {
              this.state.testcase.attachments = (this.state.testcase.attachments || []).filter(attachment => attachment.id !== attachmentId);
              this.setState(this.state);
              this.onTestcaseUpdated();
          }).catch(error => {Utils.onErrorMessage("Couldn't remove attachment: " + error.message)});
    }

    getAttachmentUrl(attachment){
        return (
            <div className="row">
                <div className="col-sm-11">
                    <a href={'/api/' + this.state.projectId +
                        '/testcase/attachment/' + this.state.testcase.id + '/' +
                        attachment.id} target='_blank'>{attachment.title}</a>
                </div>
                <div className="col-sm-1">
                    <span className="clickable edit-icon-visible red" onClick={(e) => this.removeAttachment(attachment.id, e)}>
                        <FontAwesomeIcon icon={faMinusCircle}/>
                    </span>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div>
                <div id="files" className="attachments-list">
                {(
                    (this.state.testcase.attachments || []).map(this.getAttachmentUrl)
                )}
                </div>

                <div>
                    <form id="file-form" enctype="multipart/form-data">
                        <div class="file-loading">
                            <input id="file-data" class="file" type="file" name="file" multiple data-min-file-count="0" data-theme="fas"/>
                        </div>
                        <br/>
                        <button type="reset" class="btn btn-light">Reset</button>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>

        );
      }


}

export default Attachments;
