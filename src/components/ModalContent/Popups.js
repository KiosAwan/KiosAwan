import React, { useState } from 'react';
import { View } from 'react-native';
import { MyModal } from "../Picker/SelectBoxModal";
import { Text } from '../Text/CustomText'
import { CardItem } from 'native-base';

const _Popup = (props) => {
	return (
		<View>
			<MyModal visible={props.open}
				body={[
					<CardItem header>{props.title}</CardItem>,
					<CardItem>{props.children}</CardItem>,
					<CardItem footer>

					</CardItem>
				]}
				title
				footer
				backdropDismiss={props.close}
			/>
		</View>
	)
}

const Popup = {
	Wow: () => {
		alert(2)
	},
	alert: (props) => {
		return (
			<_Popup {...props} />
		)
	}
}

export default Popup