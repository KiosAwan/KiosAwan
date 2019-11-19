import React, { Component } from 'react';
import { View, Text } from 'react-native';
import BarStatus from '../../components/BarStatus';

export default class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <BarStatus/>
        <Text> Stock </Text>
      </View>
    );
  }
}
