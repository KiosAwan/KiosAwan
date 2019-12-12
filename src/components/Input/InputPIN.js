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
            placeholder="Enter your password"
            placeholderTextColor={props.placeholderTextColor}
            autoFocus={true}
            style={{color : props.textColor ? props.textColor:'white',fontSize : 20, borderBottomColor:'pink', textAlign : props.position || "center"}}
            value={props.value}
            keyboardType="default"
            onChangeText={props.handleChangeText}
            />
        </Item>
      </View>
    );
}