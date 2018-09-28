import {
  LOGIN,
  FETCH_COMMENTS,
  NEW_COMMENTS,
  ORDER_COMMENTS,
  NAME_LOGIN,
  NO_SITE,
  SET_WEBSITE_DATA,
} from '../actions/types';

// initialating new state

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// if you want another state to be merged with the main store simply create new file with this boilerplate
// and import it to /reducers/index.js and combine them togeather to the main store
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const initialState = {
  user:
    typeof window !== 'undefined' && localStorage.getItem('user')
      ? localStorage.getItem('user')
      : {},
  commentsArray: [],
  orderedComments: [],
  error: {},
  noSiteFound: '',
  websiteData: {},
};

// each case must have the state and an action args
// the reducer check the <type> prop passed inside the action call and call the proper reducer to update
// the new state in the store (i.e <items>, <item>) with the new value i.e. <action.payload>
// (check /postAction to see implementation)

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state, // passing copy of the state
        user: action.payload, // passing new data from the action call (check /postAction to see implementation)
      };

    case FETCH_COMMENTS:
      return {
        ...state, // passing copy of the state
        commentsArray: action.payload, // passing new data from the action call (check /postAction to see implementation)
        //noSiteFound:''
      };

    case NEW_COMMENTS:
      return {
        ...state, // passing copy of the state
        commentsArray: action.payload, // passing new data from the action call (check /postAction to see implementation)
        noSiteFound: '', // fix the but when irst comment on new page wont show because of the conditional rendering in <Main/>
      };

    case ORDER_COMMENTS:
      return {
        ...state, // passing copy of the state
        orderedComments: action.payload, // passing new data from the action call (check /postAction to see implementation)
      };

    case NAME_LOGIN:
      return {
        ...state, // passing copy of the state
        user: action.payload, // passing new data from the action call (check /postAction to see implementation)
      };

    case NO_SITE:
      return {
        ...state, // passing copy of the state
        noSiteFound: action.payload, // passing new data from the action call (check /postAction to see implementation)
      };

    case SET_WEBSITE_DATA:
      return {
        ...state, // passing copy of the state
        websiteData: action.payload,
      };

    default:
      return state;
  }
}
