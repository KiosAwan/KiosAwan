import React from 'react'
import { Switch } from 'react-native'
import { ColorsList } from '../../styles/colors'

const SwitchButton = (props) => {
   return (
         <Switch
         thumbColor={props.toggleValue ? "#cd0192" : 'grey'}
         trackColor={{true: ColorsList.primaryColor, false: 'grey'}}
         onValueChange = {props.handleChangeToggle}
         value = {props.toggleValue}/>
   )
}
export default SwitchButton