import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip} from 'recharts';
import math from 'mathjs';

class Jump extends Component {
  identifyJumpType = timestamps => {
    const { jump } = this.props;
    let attackJumps = 0;
    let blockJumps = 0;
    let index = 0;
    let initialTimestamp = timestamps[index];
    let finalTimestamp = timestamps[index + 1];
    console.log(`jump type ${jump.get('type') === 0 ? 'ATTACK' : 'BLOCK'}`);
    while (finalTimestamp) {
      // eslint-disable-next-line
      const gyroData = jump.get('gyro').filter(data =>
        data.get('timestamp') >= initialTimestamp && data.get('timestamp') <= finalTimestamp
      );
      const gyroYData = gyroData.map(data => data.get('y')).toJS();
      if (gyroYData.length > 0) {
        //console.log('min gyro y', math.min(gyroYData));
        //console.log('max gyro y', math.max(gyroYData));
        //console.log('height', math.pow((finalTimestamp - initialTimestamp)/1000, 2)*9.8);
        if (math.min(gyroYData) <= -0.6 || math.max(gyroYData) >= 0.6) {
          attackJumps++;
        } else {
          blockJumps++;
        }
      } else {
        blockJumps++;
      }

      /*
      const accData = jump.get('acc').filter(data =>
        data.get('timestamp') >= initialTimestamp && data.get('timestamp') <= finalTimestamp
      );
      const accYData = accData.map(data => data.get('y')).toJS();
      if (accYData.lenth > 0) {
        console.log('min acc y', math.min(accYData));
        console.log('max acc y', math.max(accYData));
      } else {
        console.log('acc data empty');
      }
      */
      index = index + 2;
      initialTimestamp = timestamps[index];
      finalTimestamp = timestamps[index + 1];
    }

    console.log('attack jumps', attackJumps);
    console.log('block jumps', blockJumps);
    console.log('timestamps count', timestamps.length);
    return {
      blockJumps,
      attackJumps
    };

  }
  findJumps = () => {
    const { jump } = this.props;
    let intersections = 0;
    let currentValueBiggerThan3 = false;
    const timestamps = [];
    const gravityData = jump.get('gravity');
    gravityData.forEach((data) => {
      if (data.get('z') < -3 && currentValueBiggerThan3) {
        intersections++;
        currentValueBiggerThan3 = false;
        timestamps.push(data.get('timestamp'));
      } else if (data.get('z') > -3 && !currentValueBiggerThan3) {
        intersections++;
        currentValueBiggerThan3 = true;
        timestamps.push(data.get('timestamp') + 200);
      }
    });

    return {
      jumpsCounter: Math.floor(intersections / 2),
      ...this.identifyJumpType(timestamps)
    }
  }
  render() {
    const { jump, jumpTime } = this.props;
    const { jumpsCounter, attackJumps, blockJumps } = this.findJumps();
    console.log('jumps counter: ', jumpsCounter);
    console.log(jump.toJS());
    const acc = [];
    const gyro = [];
    const gravity = [];
    const heights = [];
    jump.get('acc').forEach((data, index) => {
      acc.push({ index: data.get('timestamp'), y: data.get('y'), x: data.get('x'), z: data.get('z')});
    });
    jump.get('gyro').forEach((data, index) => {
      gyro.push({ index: data.get('timestamp'), y: data.get('y'), x: data.get('x'), z: data.get('z')});
    });
    jump.get('gravity', []).forEach((data, index) => {
      gravity.push({ index: data.get('timestamp'), x: data.get('x'),
        y: data.get('y'), z: data.get('z')
      });
    });
    jump.get('heights', []).forEach((data, index) => {
      heights.push({ index, data });
    });
    return (
      <div className="Jump">
        <h1>Jump {jumpTime}</h1>
        <h2>Type {jump.get('type') === 0 ? 'ATTACK' : 'BLOCK'}</h2>
        <h3>Total of Jumps: {jumpsCounter}</h3>
        <h4>Attack Jumps: {attackJumps}</h4>
        <h4>Block Jumps: {blockJumps}</h4>
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
          <Line type="monotone" dataKey="z" stroke="#387908" />
          <Line type="monotone" dataKey="y" stroke="#ff7300" />
        </LineChart>
        <p>Gravity</p>
        <LineChart width={500} height={300} data={gravity} style={{'margin': '0 auto'}}>
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
