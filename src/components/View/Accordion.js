import React, { useState } from 'react';
import { View, StyleSheet } from "react-native";
import { ColorsList } from 'src/styles/colors';
import { Button } from '../Button/Button';
import { Text } from '../Text/CustomText';
import { Image } from '../CustomImage';


const Accordion = props => {
	const [expanded, setExpanded] = useState(false)
	const { children, title } = props
	return <View style={props.style}>
		<Button noRadius wrapper={{ justify: 'space-between' }} onPress={() => setExpanded(!expanded)} {...props.button}>
			{['string', 'number'].includes(typeof title) ? <Text color={ColorsList[props.titleColor] || ColorsList.whiteColor}>{title}</Text> : title}
			{/* <Icon name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} color={ColorsList[props.titleColor] || ColorsList.whiteColor} /> */}
			<Image style={{ transform: expanded ? [{ rotate: '270deg' }] : [{ rotate: '90deg' }] }} size={30} source={require('src/assets/icons/next.png')} />
		</Button>
		{
			expanded ? ['string', 'number'].includes(typeof children) ? <Text>{children}</Text> : children : null
		}
	</View>
}
export default Accordion