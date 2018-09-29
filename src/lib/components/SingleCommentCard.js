import React from 'react';
import { Card, Comment } from 'semantic-ui-react';
import MaterialBtn from '@material-ui/core/Button';
import 'semantic-ui-css/semantic.min.css';
import ReactMarkdown from 'react-markdown';

const SingleCommentCard = props => {
  console.log('props.userAvatar', props.userAvatar);
  console.log('type of time ', new Date(props.date));
  console.log('date arr', new Date(props.date).toDateString().split(' '));
  console.log('date arr', new Date().toDateString().split(' '));
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

  function checkIfcommentToday() {
    if (
      new Date(props.date)
        .toDateString()
        .split(' ')
        .join()
    )
      return true;
    else return false;
  }

  /***
   ** @date {param}
   **logic to show time stemp - if today show "Today HH:MM:SS else show full date
   **if the date string includes "Daylight" write "AM" else write "PM"
   ***/

  let date = (
    <div style={{ marginTop: `-1px` }}>
      {checkIfcommentToday() ? (
        <p style={{ margin: '-1px', float: 'left' }}>
          {`Today ${new Date(props.date).toString().split(' ')[4]}`}
        </p>
      ) : (
        <p style={{ margin: '-1px', float: 'left', marginLeft: '0px' }}>
          {new Date(props.date).toDateString()}
        </p>
      )}
    </div>
  );

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

  console.log(
    'includes',
    `${JSON.stringify(date.toString()).includes('Today')}`
  );

  return (
    <Card style={{ width: '100%', marginBottom: '20px' }}>
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
    </Card>
  );
};

export default SingleCommentCard;
