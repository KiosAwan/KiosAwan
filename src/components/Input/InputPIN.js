import React, { useState } from 'react'
import {View } from 'react-native'
import {
    Item,
    Input,
    Icon
} from 'native-base'
import { ColorsList } from 'src/styles/colors';

export const InputPIN = (props) =>  {
  const [secure, setSecure] = useState(true)
    return (
      <View style={{alignItems : "center", flexDirection : 'row'}}>
        <Item style={{width : props.inputWidth, borderBottomColor :'#e831ae'}}>
            <Input
            secureTextEntry={secure}
            placeholder="Masukkan password"
            placeholderTextColor={props.placeholderTextColor || ColorsList.primaryColor}
            autoFocus={true}
            style={{ color : props.textColor ? props.textColor:'white',fontSize : 20, borderBottomColor:'pink', textAlign : props.position || "center"}}
            value={props.value}
            keyboardType="default"
            onChangeText={props.handleChangeText}
            />
        </Item>
        <Icon onPress={() => setSecure(!secure)} style={{color : 'white'}} name={secure ? "eye" : "eye-off"}/>
      </View>
    );
}