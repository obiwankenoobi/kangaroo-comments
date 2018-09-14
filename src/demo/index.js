import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if (typeof window !== 'undefined') {
    ReactDOM.render(<App />, document.getElementById('root'));
}
registerServiceWorker();
