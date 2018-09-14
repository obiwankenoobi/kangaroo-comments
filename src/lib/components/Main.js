import React, { Component } from 'react';
import CommentsList from './CommentsList'
import axios from 'axios'
import socketIOClient from 'socket.io-client';
import { connect } from 'react-redux';
import helpers from '../config';
import MaterialBtn from '@material-ui/core/Button';
import {fetchCommentsFromServer , updateNewComment , addWebsiteDataToStore , noSiteHandler} from '../actions/commentsAction'
import NameLogin from './NameLogin'
import 'semantic-ui-css/semantic.min.css';
import { TextArea } from 'semantic-ui-react';
import MetaTags from 'react-meta-tags';


class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {
        siteName:this.props.websiteData.siteName, // the website name
        pageName:this.props.websiteData.pageName, // the spesific page name
        noEnoughChars:false,
      }
    }
  
    componentWillMount() {
      this.broadcastComments()
    }
  
    componentDidMount() {
      // add details to store
      this.props.addWebsiteDataToStore(this.props.siteName, this.props.pageName)

      // fetch initial comments
      this.props.fetchCommentsFromServer(this.props.siteName, this.props.pageName)

    }
  
  
    // function to create socket listener to new comments 
    broadcastComments = () => {
      const socket = socketIOClient(`${helpers.server}`) // open socket connection
      socket.on('comment', (comments) => { // add event listener to `comment` event with arg of the <comments> array from the server
  
      helpers.alertD('comments broadcast', comments)
      // checking if this page is the page with the data we want 
        if (comments.siteName == this.props.websiteData.siteName && comments.pageName == this.props.websiteData.pageName) {
          helpers.alertD('update', comments.response)
          const commentsData = comments.response
          helpers.alertD('this.state', this.state)
          // update new comments object in redux store
          this.props.updateNewComment(commentsData)
        }    
      })
    }
  
  
    // function to send comment to the root of the page and not to other comment
    sendRootComment = () => {
      let commentToAdd = {
        usernameWhoComment:this.props.user.name,
        siteName:this.props.websiteData.siteName, // the website name
        pageName:this.props.websiteData.pageName, // the spesific page name
        text:this.state.textBox, // the text to reply on
        date: new Date()
      }
      axios.post(`${helpers.server}/addcomment`, commentToAdd)
      .then((res) => {
        helpers.alertD('response after comment sent', res.data)

        if (res.data != 'noSiteFound') {
          this.setState({
            openReply:false,
            textBox:''
        }, () => {
          let pageData = {
            siteName:this.props.websiteData.siteName, // the website name
            pageName:this.props.websiteData.pageName, // the spesific page name
        }
          // on response (after comment are updated in the db) emit `comment` event to the server to update the UI
          const socket = socketIOClient(`${helpers.server}`)
            socket.emit('comment', pageData)
            helpers.alertD('msg sent')
          })
        } else {
          console.log('no site exist with that token')
          this.props.noSiteHandler();
        }
      })
    }
  
  
    // fucntion to handle input from <input/>
    handleInput = (e) => {
      this.removeNoEnoughCharsError()
      let target = e.target;
      let name = target.name;
      let value = target.value;
      this.setState({[name]:value}, () => helpers.alertD(this.state[name]))
    }

    // check if the length of the input is meet the rules
    // if id doesnt add an error to state
    isEnoughChars = (
      comment, // comment string
      sendCommentCB // send comment callback
    ) => {
      if (!comment || comment.length < 5 || comment.length > 1000) {
        this.setState({
          noEnoughChars:true,
          borderInputError:'#E9B1B2',
          bgInputError:'#FFF5F6'
        })
      } else {
        sendCommentCB()
      }
    }

    // remove the error for not enough chars
    // invoked when typing new data to input
    removeNoEnoughCharsError = () => {
      if (this.state.noEnoughChars) {
        this.setState({noEnoughChars:false})
      }
    }


	render() {

    let textBoxErrorCSS = {
      borderColor: this.state.noEnoughChars ? this.state.borderInputError : '',
      backgroundColor: this.state.noEnoughChars ? this.state.bgInputError : ''
    }
    helpers.alertD('this.props.noSiteFound', this.props.noSiteFound)

    let actionBtn = (
        <div>
            {
              JSON.parse(localStorage.getItem('user')) && JSON.parse(localStorage.getItem('user')).name != '' ?
              <MaterialBtn onClick={() => this.isEnoughChars(this.state.textBox, this.sendRootComment)} className='sendBtn' color='primary'>send</MaterialBtn>
              :
              <div>
              <NameLogin noEnoughChars={this.state.noEnoughChars}/>
                  <br/>
                  <br/>
              </div>
            }
        </div> 
    )

		return (
      <div className="App">
        <MetaTags>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossOrigin="anonymous"/>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
        </MetaTags>
				{style}
				<div className='textBox-container'>
          <TextArea style={{ ...textBoxErrorCSS , minHeight: 100 }} autoHeight={true} value={this.state.textBox} type='text' onChange={(e) => this.handleInput(e)} name='textBox' className='textBox'/>
          { this.state.noEnoughChars ? <label style={{color:'red', position:'relative', float:'right'}}>min 5 chars and max 1000 chars</label> : null }

          {actionBtn}
  
					{
						this.props.noSiteFound != 'noSiteFound' ? 
							<CommentsList  
								comments={this.props.commentsArray}/> 
							: null
					}
              
				</div>
			</div>
		);
	}
}


const style = (
    <style jsx='true'>
      {`
        textarea:focus {
          outline:0;
          
        }

        .textBox-container {
          margin-left:auto;
          margin-right:auto;
          margin-top:50px;

        }
        .textBox {
          height:100px;
          width:100%;
          margin-left:auto;
          margin-right:auto;
          -webkit-appearance: none;
        }
        textarea {
          border-radius:5px;
          border-color:#d3d3d3;
          padding-left:10px;
          padding-top:10px;
      }
        .sendBtn {
          display:block;
          margin-bottom:50px;
        }
      `}
    </style>
  )

const mapStateToProps = state => ({
  user:state.comments.user,
  commentsArray:state.comments.commentsArray,
  noSiteFound:state.comments.noSiteFound,
  websiteData:state.comments.websiteData
})


export default connect(mapStateToProps, {fetchCommentsFromServer , updateNewComment, addWebsiteDataToStore , noSiteHandler})(Main);