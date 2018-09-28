import React, { Component } from 'react';
import helpers from '../config';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

import { connect } from 'react-redux';
import CommentCard from './SingleCommentCard';
import MaterialBtn from '@material-ui/core/Button';
import NameLogin from './NameLogin';
import { TextArea } from 'semantic-ui-react';

class SingleComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openReply: false,
      noEnoughChars: false,
    };
  }

  // open the reply section
  openReply = id => {
    this.setState(
      {
        openReply: !this.state.openReply,
      },
      () => helpers.alertD(this.state.openReply, id)
    );
  };

  handleInput = e => {
    this.removeNoEnoughCharsError();
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({ [name]: value }, () => helpers.alertD(this.state[name]));
  };

  // check if the length of the input is meet the rules
  // if id doesnt add an error to state
  isEnoughChars = (
    comment, // comment string
    sendCommentCB // send comment callback
  ) => {
    if (!comment || comment.length < 5 || comment.length > 1000) {
      this.setState({
        noEnoughChars: true,
        borderInputError: '#E9B1B2',
        bgInputError: '#FFF5F6',
      });
    } else {
      sendCommentCB();
    }
  };

  // remove the error for not enough chars
  removeNoEnoughCharsError = () => {
    if (this.state.noEnoughChars) {
      this.setState({ noEnoughChars: false });
    }
  };

  // function to add comment on another comment
  sendCommend = (
    commentIdToReplyOn, // comment id to reply on (each comment has uniqe ID as ref)
    text // the text of comments
  ) => {
    let commentToAdd = {
      usernameWhoComment: this.props.user.name, // the username who make the comment
      siteName: this.props.websiteData.siteName, // the website name (ref)
      pageName: this.props.websiteData.pageName, // the spesific page name (ref)
      commentIdToReplyOn: commentIdToReplyOn, // the comment id to reply on (ref)
      text: text, // the text to reply on
      date: new Date(),
    };

    axios.post(`${helpers.server}/addcomment`, commentToAdd).then(() => {
      this.setState(
        {
          openReply: false, // close the reply section after making the comment
          replyMsg: '', // clean the text prop after replying
        },
        () => {
          // object with the page and site refs to use in the socket server to fetch the data we need according to
          let pageData = {
            siteName: this.props.websiteData.siteName, // the website name
            pageName: this.props.websiteData.pageName, // the spesific page name
          };

          // on response (after comment are updated in the db) emit `comment` event to the server to update the UI
          const socket = socketIOClient(`${helpers.server}`);
          socket.emit('comment', pageData); // emiting `comment` event with the page info
        }
      );
      helpers.alertD('msg sent');
    });
  };

  render() {
    // css to handle errors on inputs
    let textBoxErrorCSS = {
      borderColor: this.state.noEnoughChars ? this.state.borderInputError : '',
      backgroundColor: this.state.noEnoughChars ? this.state.bgInputError : '',
    };

    // this decide if show you login btn or reply btn based on the user status
    let actionBtn = (
      <div>
        {// this.props.user.accessToken ?
        this.props.user &&
          this.props.user.name && (
            <MaterialBtn
              color="primary"
              onClick={() =>
                this.isEnoughChars(this.state.replyMsg, () =>
                  this.sendCommend(this.props.commentId, this.state.replyMsg)
                )
              }
              className="sendBtn"
            >
              send
            </MaterialBtn>
          )}
      </div>
    );
    return (
      <div
        style={{
          height: '100%',
          paddingLeft: `${(this.props.depth * 3).toString()}rem`,
          //marginBottom: `${this.state.openReply ? '50px': ''}` // the margin to use when reply mode is on to allow the textbox be visible
        }}
        className="msg-container"
      >
        <CommentCard
          usernameWhoComment={this.props.usernameWhoComment}
          text={this.props.text}
          openReply={() => this.openReply(this.props.commentId)}
        />

        {this.state.openReply ? (
          <div>
            <TextArea
              style={{ ...textBoxErrorCSS, minHeight: 100, width: '100%' }}
              value={this.state.replyMsg}
              type="text"
              onChange={e => this.handleInput(e)}
              name="replyMsg"
              className="replyMsg"
            />
            {this.state.noEnoughChars ? (
              <label
                style={{ color: 'red', position: 'relative', float: 'right' }}
              >
                min 5 chars and max 1000 chars
              </label>
            ) : null}
            {actionBtn}
            <br />
            <br />
          </div>
        ) : null}
      </div>
    );
  }

  style = (
    <style jsx="true">
      {`
        button:focus {
          outline: 0;
        }

        textarea:focus {
          outline: 0;
        }

        textarea {
          border-radius: 5px;
          border-color: #d3d3d3;
          padding-left: 10px;
          padding-top: 10px;
        }
        .comment-text {
          float: left;
        }
        .reply-container {
          width: 100%;
        }
        .reply-btn {
          float: right;
        }
        .replyMsg {
          height: 100px;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          margin-top: 10px;
          -webkit-appearance: none;
        }
        .avatar {
          background-color: black;
          height: 90px;
        }
        .msg-body {
          background-color: red;
        }
        .msg-container {
          width: 100%;
          height: 100px;
          margin-right: auto;
          margin-left: auto;
        }
      `}
    </style>
  );
}

const mapStateToProps = state => ({
  user: state.comments.user,
  websiteData: state.comments.websiteData,
});

export default connect(mapStateToProps)(SingleComment);
