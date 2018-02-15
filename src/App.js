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
    // 25-11: Salto com sensor - algoritmo de aprendizagem não convergiu
    // 06-01: Salto com acelerometro do dispositivo - algoritmo convergiu com 100%
    // 23-01: Novos saltos com acelerometro do dispositivo - validação ficou em 66%
    const datesOfJumps = ['25-11-17', '06-01-18', '23-01-18'];
    const jumps = [];
    if (events) {
      let immutableEvents = fromJS(events);
      immutableEvents = immutableEvents.filter((value, key) =>
      datesOfJumps.indexOf(key.substring(0, 8)) !== -1 && (value.get('type') === 0 || value.get('type') === 1)).sort();
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
