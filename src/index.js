import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log('User is logged in!');
  }
});
firebase.auth().signInAnonymously().catch(function(error) {
  console.error('ERROR!!!', error);
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
