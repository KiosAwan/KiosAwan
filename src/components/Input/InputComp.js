import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import {
    Item,
    Input,
    Label,
    Textarea
} from 'native-base'

// Reusable Input Text
export const InputText = (props) =>  {
    return (
      <View style={{alignItems : "center"}}>
        <Item stackedLabel style={{width : 250}}>
      <Label style={{color : 'white'}}>{props.label}</Label>
            <Input  
            placeholder="Full name"
            placeholderTextColor="#ff85ed"
            style={{color:'white'}}
            autoFocus={true}
            value={props.value}
            keyboardType="default"
            onChangeText={props.handleChangeText}
            />
        </Item>
      </View>
    );
}

// Reusable Input Number
export const InputNumber = (props) =>  {
    return (
      <View>
        <Item style={{width : props.inputWidth, borderBottomColor :'#e831ae'}}>
          <Label style={{fontSize : 20, color : 'white'}}>+62</Label>
            <Input
            autoFocus={true}
            style={{color : 'white', borderBottomColor:'transparent', fontSize : 20, margin: 0,padding: 0}}
            value={props.value}
            keyboardType="phone-pad"
            onChangeText={props.handleChangeText}
            />
        </Item>
      </View>
    );
}

export const InputWithLabel = (props) =>  {
  return (
    <View>
      <Item stackedLabel style={{width : '100%'}}>
      <Label>{props.label}</Label>
      <Input  
      disabled={props.disabled || false}
      placeholder={props.placeholder}
      value={props.value}
      keyboardType={props.keyboardType || "default"}
      onChangeText={props.handleChangeText}
      />
      </Item>
    </View>
  );
}

export const InputTextArea = (props) =>  {
  return (
    <View style={{alignItems : "center"}}>
      <Item stackedLabel style={{width : '100%'}}>
      <Label>{props.label}</Label>
      <Textarea  
      rowSpan={4}
      disabled={props.disabled || false}
      placeholder={props.placeholder}
      placeholderTextColor="#ff85ed"
      value={props.value}
      keyboardType="default"
      onChangeText={props.handleChangeText}
      />
      </Item>
    </View>
  );
}

