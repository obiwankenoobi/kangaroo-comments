import React, { Component } from 'react';
import CommentsList from './CommentsList';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { connect } from 'react-redux';
import helpers from '../config';
import MaterialBtn from '@material-ui/core/Button';
import {
  fetchCommentsFromServer,
  updateNewComment,
  addWebsiteDataToStore,
  noSiteHandler,
  loginHandler,
} from '../actions/commentsAction';
import NameLogin from './NameLogin';
import 'semantic-ui-css/semantic.min.css';
import { TextArea } from 'semantic-ui-react';
import MetaTags from 'react-meta-tags';
import crypto from 'crypto';
import { GoogleLoginButton } from 'react-social-login-buttons';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteName: this.props.websiteData.siteName, // the website name
      pageName: this.props.websiteData.pageName, // the spesific page name
      noEnoughChars: false,
      openGoogleAuth: false,
    };
  }

  componentWillMount() {
    // add listener to new comments
    this.broadcastComments();
  }

  componentDidMount() {
    // add the current website details to store
    this.props.addWebsiteDataToStore(this.props.siteName, this.props.pageName);

    // fetch initial comments
    this.props.fetchCommentsFromServer(
      this.props.siteName, // by siteName
      this.props.pageName // bt pageName
    );

    // set the user auth object in store
    if (localStorage.getItem('user')) {
      this.props.loginHandler(JSON.parse(localStorage.getItem('user')));
    }
  }

  // function to create socket listener to new comments
  broadcastComments = () => {
    const socket = socketIOClient(`${helpers.server}`); // open socket connection

    // add event listener to `comment` event with arg of the <comments> array from the server
    // on every 'comment' event the server will send data which we have access to in the <comments> param
    socket.on('comment', comments => {
      helpers.alertD('comments broadcast', comments);
      // checking if this page is the page with the data we want
      // meaning - Socket will sent the whole comments from the server so here
      // we make sure to recieve only these who match our params
      if (
        comments.siteName == this.props.websiteData.siteName &&
        comments.pageName == this.props.websiteData.pageName
      ) {
        helpers.alertD('update', comments.response);
        const commentsData = comments.response;
        helpers.alertD('this.state', this.state);
        // update new comments object in redux store
        this.props.updateNewComment(commentsData); // <== redux action to update the store with the new comments
      }
    });
  };

  // function to send comment to the root of the page and not to other comment
  sendRootComment = () => {
    helpers.alertD('this.props.user.name', this.props.user.name);
    let commentToAdd = {
      usernameWhoComment: this.props.user.name, // the user name we fetched from google auth
      userAvatar: this.props.user.image, // the user avatar we fetched from google auth
      siteName: this.props.websiteData.siteName, // the website name
      pageName: this.props.websiteData.pageName, // the spesific page name
      text: this.state.textBox, // the text to reply on
      date: new Date(),
    };
    axios.post(`${helpers.server}/addcomment`, commentToAdd).then(res => {
      helpers.alertD('response after comment sent', res.data);

      // the server will return 'noSiteFound' if there isnt match with the data
      // that has being passed
      if (res.data != 'noSiteFound') {
        this.setState(
          {
            openReply: false,
            textBox: '',
          },
          () => {
            let pageData = {
              siteName: this.props.websiteData.siteName, // the website name
              pageName: this.props.websiteData.pageName, // the spesific page name
            };

            // on response (after comment are updated in the db)
            // open a socket connection &&
            // emit/send `comment` event to the server with the data
            const socket = socketIOClient(`${helpers.server}`);
            socket.emit('comment', pageData);
            helpers.alertD('msg sent');
          }
        );
      } else {
        console.error('no site exist with that token');
        this.props.noSiteHandler();
      }
    });
  };

  // fucntion to handle input from <input/>
  handleInput = e => {
    this.removeNoEnoughCharsError();
    let target = e.target;
    let name = target.name;
    let value = target.value;
    this.setState({ [name]: value }, () => helpers.alertD(this.state[name]));
  };

  // check if the length of the input is meet the rules
  // if id doesnt add an error to state
  validateNameAndSendComment = (
    comment, // comment string
    sendCommentCB // send comment callback
  ) => {
    // check if the input meet the carterea
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
  // invoked when typing new data to input
  removeNoEnoughCharsError = () => {
    if (this.state.noEnoughChars) {
      this.setState({ noEnoughChars: false });
    }
  };

  // open google auth window with the siteName && pageNAme props as query to later match with the site that has made the call
  openGoogleAuth = (googleAuthListenerCB, tokenCreateCB) => {
    // creating token to match socket call
    const token = tokenCreateCB(10);

    // open auth window
    window.open(
      `${helpers.server}/auth/google?siteName=${this.props.siteName}&pageName=${
        this.props.pageName
      }&token=${token}`,
      '_blank'
    );

    // creating socket listener with the client token to match when the user object returned
    googleAuthListenerCB(token);
  };

  // listener to googleAuth event in socket
  googleAuthListener = token => {
    const socket = socketIOClient(`${helpers.server}`); // open socket connection
    socket.on(
      `googleAuth-${this.props.siteName}-${this.props.pageName}-${token}`,
      userAuth => {
        helpers.alertD('getting data', userAuth);

        // setting the user name and image in the localstorage
        let userSession = {
          name: userAuth.user.displayName,
          image:
            userAuth.user.photos.length > 0
              ? userAuth.user.photos[0].value
              : '',
        };
        helpers.alertD('userSession', userSession);
        localStorage.setItem('user', JSON.stringify(userSession));
        this.props.loginHandler(JSON.parse(localStorage.getItem('user')));
      }
    );
  };

  // creating token to match socket call when user will login with google
  // so socket will know where to send the user object
  createTokenToMatchSocket = chars => {
    if (!Number.isFinite(chars)) {
      throw new TypeError('Expected a finite number');
    }

    return crypto
      .randomBytes(Math.ceil(chars / 2))
      .toString('hex')
      .slice(0, chars);
  };

  render() {
    // TEST FOR COMMENTS ARRAY
    if (this.props.commentsArray.length > 0) {
      helpers.alertD(this.props.commentsArray);
    }



    helpers.alertD('this.props.user', this.props.user);
    // css to make the error validation on each input
    let textBoxErrorCSS = {
      borderColor: this.state.noEnoughChars ? this.state.borderInputError : '',
      backgroundColor: this.state.noEnoughChars ? this.state.bgInputError : '',
    };
    helpers.alertD('this.props.noSiteFound', this.props.noSiteFound);

    // set of rules to know when to render Name input od the Send function
    // basically if user aint "logged in" yet
    let actionBtn = (
      <div>
        {this.props.user && this.props.user.name ? (
          <MaterialBtn
            onClick={() =>
              this.validateNameAndSendComment(
                this.state.textBox,
                this.sendRootComment
              )
            }
            className="sendBtn"
            color="primary"
          >
            send
          </MaterialBtn>
        ) : (
          <div>
            <div>
              <GoogleLoginButton
                style={{
                  fontSize: '12px',
                  width: '136px',
                  height: '30px',
                  margin: 0,
                  borderRadius: '5px',
                }}
                onClick={() =>
                  this.openGoogleAuth(this.googleAuthListener, () =>
                    this.createTokenToMatchSocket(10)
                  )
                }
                iconSize={'12px'}
              >
                <span>Login to comment</span>
              </GoogleLoginButton>
            </div>

            <br />
            <br />
          </div>
        )}
      </div>
    );

    return (
      <div className="App">
        {style}

        <MetaTags>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
            integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
          />
        </MetaTags>

        {this.style}

        <div className="textBox-container">
          <TextArea
            style={{
              ...textBoxErrorCSS,
              minHeight: 100,
            }}
            autoHeight={true}
            value={this.state.textBox}
            type="text"
            onChange={e => this.handleInput(e)}
            name="textBox"
            className="textBox"
          />
          {this.state.noEnoughChars && (
            <label
              style={{ color: 'red', position: 'relative', float: 'right' }}
            >
              min 5 chars and max 1000 chars
            </label>
          )}

          {actionBtn}

          {this.props.noSiteFound != 'noSiteFound' && (
            <CommentsList
              comments={this.props.commentsArray}
              openGoogleAuth={this.openGoogleAuth}
              googleAuthListener={this.googleAuthListener}
              createTokenToMatchSocket={this.createTokenToMatchSocket}
            />
          )}
        </div>
      </div>
    );
  }
}

const style = (
  <style jsx="true">
    {`
      textarea:focus {
        outline: 0;
      }

      .textBox-container {
        margin-left: auto;
        margin-right: auto;
        margin-top: 50px;
      }
      .textBox {
        height: 100px;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        -webkit-appearance: none;
      }
      textarea {
        border-radius: 5px;
        border-color: #f3f3f3;
        border-width: 1px;
        padding-left: 10px;
        padding-top: 10px;
      }
      .sendBtn {
        display: block;
        margin-bottom: 50px;
      }
    `}
  </style>
);

const mapStateToProps = state => ({
  user: state.comments.user,
  commentsArray: state.comments.commentsArray,
  noSiteFound: state.comments.noSiteFound,
  websiteData: state.comments.websiteData,
});

export default connect(
  mapStateToProps,
  {
    fetchCommentsFromServer,
    updateNewComment,
    addWebsiteDataToStore,
    noSiteHandler,
    loginHandler,
  }
)(Main);
