import React, { Component } from 'react';
import SingleComment from './SingleComment';
import { connect } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import { orderCommentsToStore } from '../actions/commentsAction';
import helpers from '../config';

class CommentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.updateCommentsOnState();
  }

  componentDidUpdate(prevProps) {
    this.updateNewCommentInState(prevProps);
  }

  // update unordered comments in state
  updateCommentsOnState = () => {
    helpers.alertD('this.props.comments', this.props.comments);
    this.setState(
      {
        comments: this.props.comments,
        user: this.props.user,
      },
      () => {
        this.orderComments(this.state.comments, 0); // assigning the commments to state
      }
    );
  };

  // function to update the new comment that updated in App.js into the state
  updateNewCommentInState = prevProps => {
    if (prevProps.comments !== this.props.comments) {
      // checking
      this.holder = []; // clean the comments holder to preper it to the new comments

      // update the state with the new comments that has being passed from Main.js after socket.io update
      this.setState(
        {
          comments: this.props.comments,
        },
        () => {
          this.orderComments(this.state.comments, 0); // assigning the commments to state
        }
      );
    }
  };

  // function to save comments IN ORDER with proper depth after passing it as object from App.js
  holder = []; // holder for the comments to use before updating them in state
  orderComments = (
    comments, // the array of comments we got
    deep // the deep of each comment branch
  ) => {
    comments.map(comment => {
      // mapping the comments
      this.holder.push({
        // pushing to holder comment object with the comment data
        commentId: comment.commentId, // the id of comments
        deep: deep, // the intend we want in comment
        text: comment.text, // the comment text
        usernameWhoComment: comment.usernameWhoComment, // the username who make the comment
      });
      this.orderComments(comment.comments, deep + 1); // doing it on each of the <comments> properties
      return this.holder; // not actually doing anything just here to remove warning about returning value from arrow function
    });

    // add ordered comments in redux store
    this.props.orderCommentsToStore(this.holder);
  };

  render() {
    return (
      <div style={{ height: 'auto' }} className="commentsList-container">
        {style}
        {this.props.orderedComments
          ? this.props.orderedComments.map((comment, i) => (
              <div key={comment.commentId}>
                <SingleComment
                  commentId={comment.commentId}
                  depth={comment.deep}
                  text={comment.text}
                  usernameWhoComment={comment.usernameWhoComment}
                  openGoogleAuth={this.props.openGoogleAuth}
                  googleAuthListener={this.props.googleAuthListener}
                  createTokenToMatchSocket={this.props.createTokenToMatchSocket}
                />
              </div>
            ))
          : null}
        <br />
      </div>
    );
  }
}

const style = (
  <style jsx="true">
    {`
      .commentsList-container {
        width: 100%;
        height: 100px;
        margin-left: auto;
        margin-right: auto;
      }
    `}
  </style>
);

const mapStateToProps = state => ({
  user: state.comments.user,
  orderedComments: state.comments.orderedComments,
});

export default connect(
  mapStateToProps,
  { orderCommentsToStore }
)(CommentsList);
