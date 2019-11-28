import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator , DrawerNavigatorItems} from 'react-navigation-drawer'
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

import { SafeAreaView, ScrollView, View} from 'react-native';
import { Button, Text } from 'native-base'


//Import Screen
import MainNavigator from './DrawerComponent/MainNavigator'
import TransactionList from '../screens/AuthScreen/TransactionList';
import DetailTransaction from '../screens/AuthScreen/DetailTransaction';
import TransactionNavigator from './DrawerComponent/TransactionNavigator';


const _onPressLogout= async (props) => {
  try {
      await AsyncStorage.removeItem('userId')
      props.navigation.navigate('UnauthNavigator')
    } 
    catch(e) {
        alert(e)      
  };

}

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{flex : 1}}>
    <ScrollView>
      <DrawerNavigatorItems {...props} activeLabelStyle={{color : '#cd0192'}} inactiveLabelStyle={{color : 'grey'}} />
    </ScrollView>
    <View>
      <Button style={{backgroundColor : '#cd0192', justifyContent : "center"}} onPress={() => _onPressLogout(props)}>
        <Text>Logout</Text>
      </Button>
    </View>
  </SafeAreaView>
)

const DrawerNavigator = createDrawerNavigator({
  Main : {
    screen : MainNavigator,
    navigationOptions: {
      header: null
    }
  },
  Transaction: {
    screen : TransactionNavigator,
    navigationOptions :{
      header : null
    }
  }
}, {
  contentComponent : CustomDrawerComponent,
})


const AuthNavigator = createStackNavigator({
  Drawer : {
    screen : DrawerNavigator,
    navigationOptions : {
      header : null
    }
  }
})


export default createAppContainer(AuthNavigator)

