import React from 'react'
import { Switch } from 'react-native'

const SwitchButton = (props) => {
   return (
         <Switch
         thumbColor="#cd0192"
         onValueChange = {props.handleChangeToggle}
         value = {props.toggleValue}/>
   )
}
export default SwitchButton