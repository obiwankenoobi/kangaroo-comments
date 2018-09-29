import React from 'react';
import { Card, Comment } from 'semantic-ui-react';
import MaterialBtn from '@material-ui/core/Button';
import 'semantic-ui-css/semantic.min.css';
import ReactMarkdown from 'react-markdown';

const SingleCommentCard = props => {
  console.log('props.userAvatar', props.userAvatar);
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
            <p style={{ margin: '-1px', fontWeight: 'bold' }}>
              {props.usernameWhoComment}
            </p>
            <p style={{ margin: '-1px', marginLeft: '-7px' }}>
              Today at 5:42PM'
            </p>
          </div>
        </div>
        <div style={{ marginLeft: '55px', marginTop: '10px' }}>
          <Card.Content style={{ textAlign: 'left', width: '100%' }}>
            <ReactMarkdown source={props.text} />
          </Card.Content>
        </div>
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
