import React from 'react'
import { Switch, Image } from 'react-native'
import { ColorsList } from '../../styles/colors'
import { Text } from '../Text/CustomText'
import { TouchableOpacity } from 'react-native-gesture-handler'

const SwitchButton = (props) => {
      return (
            <Switch
                  thumbColor={props.toggleValue ? "#cd0192" : 'grey'}
                  trackColor={{ true: ColorsList.primaryColor, false: 'grey' }}
                  onValueChange={props.handleChangeToggle}
                  value={props.toggleValue} />
      )
}
const SwitchButtons = props => {
      const style = { position: 'absolute', left: 0, width: 100, height: 100,top:0 }
      return <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row', position: 'relative' }}>
            <Image style={style} source={require('src/assets/icons/toggle-on.png')} />
            <Image style={style} source={require('src/assets/icons/toggle-slide.png')} />
            <Image style={style} source={require('src/assets/icons/toggle-off.png')} />
      </TouchableOpacity>
}
export default SwitchButton