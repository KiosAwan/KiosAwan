import React from 'react'
import {
    View,
    Text
} from 'react-native'
import { RegisterButton } from '../../components/Button/ButtonComp'

const Home = ({navigation}) => {
    
    const _onPressLogout = () => {
        navigation.navigate('UnauthNavigator')
    }
    return (
        <View style={{flex : 1, alignItems : "center", justifyContent : "center"}}>
            <Text>Ini Home Screen</Text>
            <RegisterButton
            disabled={false}
            buttonTitle="Logout"
            onPressBtn={_onPressLogout}
            />
        </View>
    )
}

export default Home