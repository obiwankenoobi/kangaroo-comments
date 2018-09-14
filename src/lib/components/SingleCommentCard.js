import React from 'react';
import { Card } from 'semantic-ui-react';
import MaterialBtn from '@material-ui/core/Button';
import 'semantic-ui-css/semantic.min.css';
import ReactMarkdown from 'react-markdown';



const SingleCommentCard = (props) => {
	return (
		<Card style={{width:'100%'}}>
			<Card.Content>
				<h5 style={{float:'left'}} >{props.usernameWhoComment}</h5>
				<Card.Description style={{textAlign:'left', width:'100%'}}>
					<ReactMarkdown source={props.text} />
				</Card.Description>
			</Card.Content>
			<Card.Content extra={true}>
				<div style={{float:'right'}}>
					<MaterialBtn onClick={props.openReply} basic="true" color='primary'>
						<i style={{fontSize:'15px'}} className="fas fa-reply"></i>
					</MaterialBtn>
				</div>
			</Card.Content>
		</Card>  
	);
};


export default SingleCommentCard;