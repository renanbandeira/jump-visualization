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
    // '11-06-18', '06-01-18', '23-01-18', '15-02-18'
    const datesOfJumps = ['18-06-12']; //18-06-12
    const jumps = [];
    if (events) {
      let immutableEvents = fromJS(events);
      /*const eventsToBeDeleted = immutableEvents.filterNot((value, key) =>
      datesOfJumps.indexOf(key.substring(0, 8)) !== -1 &&
      !value.get('acc', fromJS({})).isEmpty() && !value.get('gyro', fromJS({})).isEmpty() &&
      (value.get('type') === 0 || value.get('type') === 1));
      */
      //datesOfJumps.indexOf(key.substring(0, 8)) !== -1 && (value.get('type') === 0 || value.get('type') === 1)
      immutableEvents = immutableEvents.filter((value, key) =>
      key.indexOf(datesOfJumps[0]) !== -1 &&
      !value.get('acc', fromJS({})).isEmpty() && !value.get('gyro', fromJS({})).isEmpty()).sort();
      /*if (eventsToBeDeleted.size > 0) {
        console.log('removing trash on db');
        const eventsDB = firebase.database().ref('/events');
        eventsToBeDeleted.forEach((event, key) => {
          eventsDB.child(key).remove();
        });
      }*/
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
