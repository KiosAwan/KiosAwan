
import React from 'react';
import { StatusBar } from 'react-native';
import { ColorsList } from '../styles/colors';

const BarStatus = () => {
    return (
        <StatusBar backgroundColor={ColorsList.primaryColor}/>
    )
}

export default BarStatus;