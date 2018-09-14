import { combineReducers } from 'redux';
import commentsReducer from './commentsReducer';

// function to combine reducers and state to one store to the whole app
// meanes - you can have as many reducers as you like

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// to add more states to the main store simply create new reducer with the tamplate from /postReducer
// and import it - give it a name to access it - (i.e. <newStateObj>) and thats all
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

export default combineReducers({
	comments:commentsReducer, // passing and naming the reducer we created in ./postReducer (to access the props from this reducer you access <state.posts> as used in /Postform && /Posts)
//  newStateObj:reducerFunc
});
 
