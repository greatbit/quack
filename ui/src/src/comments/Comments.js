import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import axios from "axios";
import { withRouter } from 'react-router';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import * as Utils from '../common/Utils';

class Comments extends SubComponent {
    constructor(props) {
        super(props);
        this.state = {
             comments: [],
             commentToEdit: {}
         };

         this.projectId = props.projectId;
         this.entityId = props.entityId;
         this.entityType = props.entityType;
         this.onCommentsNumberChanged = props.onCommentsNumberChanged;
         this.getComments = this.getComments.bind(this);
         this.handleSubmit = this.handleSubmit.bind(this);
         this.handleChange = this.handleChange.bind(this);
         this.cancelEdit = this.cancelEdit.bind(this);
         this.refreshCommentToEdit = this.refreshCommentToEdit.bind(this);
         this.removeComment = this.removeComment.bind(this);
         this.refreshCommentToEdit();
         this.handleUpdateChange = this.handleUpdateChange.bind(this);
         this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
      }

    componentDidMount() {
        super.componentDidMount();
     }

    componentWillReceiveProps(nextProps) {
      var fetchCommentsNeeded = false;
      if (nextProps.entityId){
        fetchCommentsNeeded = fetchCommentsNeeded || (this.entityId != nextProps.entityId);
        this.entityId = nextProps.entityId;
        this.state.commentToEdit.entityId = nextProps.entityId;
        this.refreshCommentToEdit()
      }
      if (nextProps.entityType){
        fetchCommentsNeeded = fetchCommentsNeeded || (this.entityType != nextProps.entityType);
        this.entityType = nextProps.entityType;
        this.state.commentToEdit.entityType = nextProps.entityType;
        this.refreshCommentToEdit()
      }
      if (nextProps.projectId){
        fetchCommentsNeeded = fetchCommentsNeeded || (this.projectId != nextProps.projectId);
        this.projectId = nextProps.projectId;
      }
      if (fetchCommentsNeeded){
        this.getComments();
      } else {
        this.setState(this.state);
      }
    }

    refreshCommentToEdit(){
        this.state.commentToEdit = {text: "", entityId: this.entityId, entityType: this.entityType};
    }

    getComments(){
        axios
          .get("/api/"  + this.projectId + "/comment?entityType="+ this.entityType + "&entityId=" + this.entityId + "&orderby=createdTime&orderdir=DESC")
          .then(response => {
            this.state.comments = response.data;
            if (this.onCommentsNumberChanged){
                this.onCommentsNumberChanged(this.state.comments.length);
            }
            this.setState(this.state);
          })
          .catch(error => console.log(error));
    }

    handleChange(fieldName, event, index){
        this.state.commentToEdit[fieldName] = event.target.value;
        this.setState(this.state);
    }

    cancelEdit(index, event){
        $("#comment-" + index + "-display").show();
        $("#comment-" + index + "-form").hide();
    }

    toggleEdit(index, event){
        $("#comment-" + index + "-display").hide();
        $("#comment-" + index + "-form").show();
    }

    removeComment(commentId, event){
        axios.delete("/api/"  + this.projectId + "/comment/" + commentId)
            .then(response => {
                this.state.comments = this.state.comments.filter(comment => comment.id != commentId);
                if (this.onCommentsNumberChanged){
                    this.onCommentsNumberChanged(this.state.comments.length);
                }
                this.setState(this.state);
        })
    }

    handleSubmit(event){
        axios.put('/api/' + this.projectId + '/comment/', this.state.commentToEdit)
            .then(response => {
                this.state.comments.unshift(response.data);
                this.refreshCommentToEdit();
                if (this.onCommentsNumberChanged){
                    this.onCommentsNumberChanged(this.state.comments.length);
                }
                this.setState(this.state);
        })
        event.preventDefault();
    }

    handleUpdateChange(index, event){
        this.state.comments[index].text = event.target.value;
        this.setState(this.state);
        event.preventDefault();
    }

    handleUpdateSubmit(index, event){
        axios.post('/api/' + this.projectId + '/comment/', this.state.comments[index])
                .then(response => {
                    this.state.comments[index] = response.data;
                    this.setState(this.state);
                    this.cancelEdit(index, event);
            })
    }



    render() {
        return (
            <div>
                <div id="comments">
                    {
                      this.state.comments.map(function(comment, i){
                          return (
                            <div className="card project-card container">
                                <div className="card-header row">
                                    <div className="col-10">
                                        <Link to={"/user/profile/" + comment.createdBy}>{comment.createdBy}</Link>  {Utils.timeToDate(comment.createdTime)}
                                    </div>

                                    { Utils.isUserOwnerOrAdmin(comment.createdBy) &&
                                        <div className="col-2">
                                            <span className="clickable edit-icon-visible" onClick={(e) => this.toggleEdit(i, e)}>
                                                <FontAwesomeIcon icon={faPencilAlt}/>
                                            </span>
                                            <span className="clickable edit-icon-visible red" onClick={(e) => this.removeComment(comment.id, e)}>
                                                <FontAwesomeIcon icon={faMinusCircle}/>
                                            </span>
                                        </div>
                                    }
                                </div>
                                <div className="card-body">
                                    <div className="inplace-display" id={"comment-" + i + "-display"} index={i}>
                                        <p className="card-text">{comment.textFormatted || ''}</p>
                                    </div>
                                    <div id={"comment-" + i + "-form"} index={i} lassName="inplace-form" style={{display: 'none'}}>
                                        <form>
                                            <textarea rows="7" cols="70" name="text" onChange={(e) => this.handleUpdateChange(i, e)} value={comment.text}></textarea>
                                            <div>
                                                <button type="button" className="btn btn-light" onClick={(e) => this.cancelEdit(i, e)}>Cancel</button>
                                                <button type="button" className="btn btn-primary" onClick={(e) => this.handleUpdateSubmit(i, e)}>Save</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                          );
                      }.bind(this))
                    }
                </div>
                <div id="comment-form">
                    <form>
                        <textarea rows="7" cols="70" name="text" onChange={(e) => this.handleChange("text", e)} value={this.state.commentToEdit.text}></textarea>
                        <div>
                            <button type="button" className="btn btn-primary" onClick={(e) => this.handleSubmit(e)}>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        );

      }

}

export default Comments;
