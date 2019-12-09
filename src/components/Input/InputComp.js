import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import {
    Item,
    Input,
    Label,
    Textarea
} from 'native-base'

const width = Dimensions.get('window').width

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
export const InputSimple = (props) =>  {
  return (
    <View>
      <Input  
      placeholder={props.placeholder}
      placeholderTextColor="white"
      value={props.value}
      keyboardType={props.keyboardType || "default"}
      onChangeText={props.handleChangeText}
      style={{color : 'white', fontSize : 15,width :width *5 /9, borderBottomColor : 'white'}}
      />
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

export const FloatingInputLabel = (props) =>  {
  const [activeColor, setActiveColor] = useState('grey')
  return (
    <View>
      <Item floatingLabel style={{width : '100%', borderBottomColor : activeColor, marginTop : 5}}>
      <Label style={{color : activeColor}}>{props.label}</Label>
      <Input  
      onFocus={() => setActiveColor('#cd0192')}
      onBlur={() => setActiveColor('grey')}
      disabled={props.disabled || false}
      value={props.value}
      keyboardType={props.keyboardType || "default"}
      onChangeText={props.handleChangeText}
      style={{margin: 0,padding: 0,color : activeColor}}
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

