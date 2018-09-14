import { createStore, applyMiddleware , compose } from 'redux';


// Redux Thunk middleware allows you to write action creators that return a function instead of an action. 
// The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. 
// The inner function receives the store methods dispatch and getState as parameters.
// MOTIVATION: to be able use async function on actions.
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const initialState = {}; // initial state obj

// array of middleware to use with redux
const middleware = [
	thunk,
]; 

const store = createStore( // <createStore> creating the store for the app
	rootReducer,  // here we pass <rootReducer> which is the combined reducers from /reducers/index.js
	initialState , // initial state object
	compose (applyMiddleware(...middleware))
);

export default store;