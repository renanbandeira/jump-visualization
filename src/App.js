import React, { Component } from 'react';
import firebase from 'firebase'
import { connect } from 'react-firebase'
import { fromJS } from 'immutable';
import logo from './logo.svg';
import Jump from './Jump';
import firebaseConfig from './firebaseConfig';
import './App.css';

firebase.initializeApp(firebaseConfig);


class App extends Component {
  render() {
    const { events } = this.props;
    const jumps = [];
    if (events) {
      let immutableEvents = fromJS(events);
      const filter = immutableEvents.keySeq().sort().last().substring(0,8);
      immutableEvents = immutableEvents.filter((value, key) =>
      key.indexOf(filter) !== -1 && (value.get('type') === 0 || value.get('type') === 1));
      if (immutableEvents.size === 0 ) {
        jumps.push(<p key="fetching">No results found</p>);
      }
      immutableEvents.forEach((event, key) => {
        jumps.push(<Jump jump={event} key={key} jumpTime={key} />);
      });
    } else {
      jumps.push(<p key="fetching">Fetching jumps data, please wait...</p>);
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Jump Chart Visualization</h1>
        </header>
        {jumps}
      </div>
    );
  }
}

export default connect((props, ref) => ({
  events: 'events'
}))(App);
