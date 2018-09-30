import React from 'react';
import { Card, Comment } from 'semantic-ui-react';
import MaterialBtn from '@material-ui/core/Button';
import 'semantic-ui-css/semantic.min.css';
import ReactMarkdown from 'react-markdown';

const SingleCommentCard = props => {
  console.log('props.userAvatar', props.userAvatar);
  console.log('type of time ', new Date(props.date));
  console.log('commant date', new Date(props.date).toDateString().split(' '));
  console.log('corrent date', new Date().toDateString().split(' '));
  console.log(
    'equel?',
    new Date(props.date)
      .toDateString()
      .split(' ')
      .join() ==
      new Date()
        .toDateString()
        .split(' ')
        .join()
  );

  // check if the comment made today
  function checkIfcommentToday() {
    if (
      new Date(props.date)
        .toDateString()
        .split(' ')
        .join() ==
      new Date()
        .toDateString()
        .split(' ')
        .join()
    )
      return true;
    return false;
  }

  /***
   ** @date {param}
   **logic to show time stemp - if today show "Today HH:MM:SS else show full date
   **if the date string includes "Daylight" write "AM" else write "PM"
   ***/

  // the date yexy with CSS adjustments
  let date = (
    <div style={{ marginTop: `-1px` }}>
      {checkIfcommentToday() ? (
        <small style={{ margin: '-1px', float: 'left' }}>
          {`Today ${new Date(props.date).toString().split(' ')[4]}`}
        </small>
      ) : (
        <small style={{ margin: '-1px', float: 'left', marginLeft: '0px' }}>
          {new Date(props.date).toDateString()}
        </small>
      )}
    </div>
  );

  // the username yexy with CSS adjustments
  let usernameWithPadding = (
    <div>
      <p
        style={{
          marginBottom: `-1px`,
          marginLeft: checkIfcommentToday() && '-1px',
          fontWeight: 'bold',
        }}
      >
        {props.usernameWhoComment}
      </p>
    </div>
  );

  // the comment yexy with CSS adjustments
  let contentWithPadding = (
    <div>
      {checkIfcommentToday() ? (
        <div style={{ marginLeft: '54px', marginTop: '10px' }}>
          <Card.Content style={{ textAlign: 'left', width: '100%' }}>
            <ReactMarkdown source={props.text} />
          </Card.Content>
        </div>
      ) : (
        <div style={{ marginLeft: '55px', marginTop: '10px' }}>
          <Card.Content style={{ textAlign: 'left', width: '100%' }}>
            <ReactMarkdown source={props.text} />
          </Card.Content>
        </div>
      )}
    </div>
  );
  console.log('props.lastComment', props.lastComment);
  return (
    <div
      style={{
        width: '100%',
        marginBottom: '20px',
        borderColor: 'white',
        borderRadius: '5px',
        backgroundColor: 'white',
        padding: '15px',
        paddingBottom: '50px',
        //borderBottom: props.lastComment ? '' : 'solid 1px #f3f3f3', // dont add border in last comment
        borderTop: 'solid 1px #f3f3f3', // dont add border in first comment
      }}
    >
      <Card.Content>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <img
            style={{
              marginRight: '5px',
              width: '40px',
              borderRadius: '5px',
            }}
            src={`${props.userAvatar || ''}`}
            alt="user avatar"
          />

          <div
            style={{
              marginLeft: '10px',
            }}
          >
            {usernameWithPadding}

            {date}
          </div>
        </div>
        {contentWithPadding}
      </Card.Content>

      <Card.Content extra={true}>
        <div style={{ float: 'right' }}>
          <MaterialBtn onClick={props.openReply} basic="true" color="primary">
            <i style={{ fontSize: '15px' }} className="fas fa-reply" />
          </MaterialBtn>
        </div>
      </Card.Content>
    </div>
  );
};

export default SingleCommentCard;
