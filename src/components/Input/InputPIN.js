import React from 'react'
import {View } from 'react-native'
import {
    Item,
    Input
} from 'native-base'

export const InputPIN = (props) =>  {
    return (
      <View style={{alignItems : "center"}}>
        <Item style={{width : props.inputWidth, borderBottomColor :'#e831ae'}}>
            <Input
            secureTextEntry={true}
            placeholder="6 digit PIN"
            autoFocus={true}
            style={{color : 'white',fontSize : 20, borderBottomColor:'pink', textAlign : "center"}}
            value={props.value}
            keyboardType="numeric"
            onChangeText={props.handleChangeText}
            />
        </Item>
      </View>
    );
}