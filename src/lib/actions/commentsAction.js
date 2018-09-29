import {
  LOGIN,
  FETCH_COMMENTS,
  NEW_COMMENTS,
  ORDER_COMMENTS,
  NAME_LOGIN,
  NO_SITE,
  SET_WEBSITE_DATA,
} from './types';
import helpers from '../config';
import axios from 'axios';

// fetching the comments array from the server
export const fetchCommentsFromServer = (siteName, pageName) => dispatch => {
  console.log('fetchCommentsFromServer');
  console.log('siteName', siteName);
  console.log('pageName', pageName);
  axios
    .post(`${helpers.server}/fetchComments`, {
      siteName: siteName,
      pageName: pageName,
    })
    .then(response => {
      console.log('response.data', response.data);
      // only assign response if its the comments object (not empty) and not an error string
      if (typeof response.data != 'string') {
        const comments = response.data;

        dispatch({
          type: FETCH_COMMENTS,
          payload: comments,
        });
      } else {
        // calling NO_SITE reducer to handle the rendering when there is no data
        dispatch({
          type: NO_SITE,
          payload: response.data,
        });
      }
    })
    .catch(e => helpers.alertD(e));
};

// function to update new comments is the array
// it update the whole comments object and send it back to store
export const updateNewComment = newComments => dispatch => {
  helpers.alertD('updateNewComment', newComments);
  dispatch({
    type: NEW_COMMENTS,
    payload: newComments,
  });
};

export const orderCommentsToStore = holder => dispatch => {
  dispatch({
    type: ORDER_COMMENTS,
    payload: holder,
  });
};

export const facebookLogin = response => dispatch => {
  localStorage.setItem('user', JSON.stringify(response));

  dispatch({
    type: LOGIN,
    payload: response,
  });
};

export const loginHandler = name => dispatch => {
  // let data = {
  //   accessToken: new Date().getTime(),
  //   name: response,
  // };

  // localStorage.setItem('user', JSON.stringify(data));

  dispatch({
    type: NAME_LOGIN,
    payload: name,
  });
};

export const addWebsiteDataToStore = (siteName, pageName) => dispatch => {
  dispatch({
    type: SET_WEBSITE_DATA,
    payload: { siteName, pageName },
  });
};

export const noSiteHandler = response => dispatch => {
  dispatch({
    type: NO_SITE,
    payload: response,
  });
};
