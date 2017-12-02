import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip} from 'recharts';

class Jump extends Component {
  render() {
    const { jump, jumpTime } = this.props;
    console.log(jump.toJS());
    const acc = [];
    const gyro = [];
    jump.get('acc').forEach((data, index) => {
      acc.push({ index, x: data.get('x'), y: data.get('y'), z: data.get('z')});
    });
    jump.get('gyro').forEach((data, index) => {
      gyro.push({ index, x: data.get('x'), y: data.get('y')});
    });
    return (
      <div className="Jump">
        <h1>Jump {jumpTime}</h1>
        <h2>Type {jump.get('type') === 1 ? 'ATTACK' : 'BLOCK'}</h2>
        <p>Acc</p>
        <LineChart width={500} height={300} data={acc} style={{'margin': '0 auto'}}>
          <XAxis dataKey="index"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="x" stroke="#8884d8" />
          <Line type="monotone" dataKey="y" stroke="#ff7300" />
          <Line type="monotone" dataKey="z" stroke="#387908" />
        </LineChart>
        <p>Gyro</p>
        <LineChart width={500} height={300} data={gyro} style={{'margin': '0 auto'}}>
          <XAxis dataKey="index"/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="x" stroke="#8884d8" />
          <Line type="monotone" dataKey="y" stroke="#ff7300" />
          <Line type="monotone" dataKey="z" stroke="#387908" />
        </LineChart>
      </div>
    );
  }
}

export default Jump;
