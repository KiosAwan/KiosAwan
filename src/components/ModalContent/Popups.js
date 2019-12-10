import React, { useState } from 'react';
import { View } from 'react-native';
import { MyModal } from "../Picker/SelectBoxModal";
import { Text } from '../Text/CustomText'
import { CardItem, Button } from 'native-base';

const _Popup = (props) => {
	return (
		<View>
			<MyModal visible={props.open}
				body={[
					<CardItem style={{ justifyContent: 'center' }} header>{props.title}</CardItem>,
					<CardItem style={{ justifyContent: 'center' }}>{props.children}</CardItem>,
					<CardItem style={{ justifyContent: 'flex-end' }} footer>
						{
							typeof props.buttons == 'object' ? Object.keys(props.buttons).map((key) => {
								const btn = props.buttons[key]
								return (
									<Button onPress={btn.onTap}>
										<Text>{btn.text}</Text>
									</Button>
								)
							}) : null
						}
					</CardItem>
				]}
				backdropDismiss={false}
			/>
		</View>
	)
}

const Popup = {
	show: (props) => {
		return <_Popup {...props} />
	},
	alert: (props) => {
		return <_Popup {...props} buttons={{
			okBtn: {
				text: 'Ok',
				onTap: () => {
					props.close(true)
				}
			}
		}} />
	},
	confirm: (props) => {
		return <_Popup {...props} buttons={{
			cancelBtn: {
				text: 'Cancel',
				onTap: () => {
					props.onClose(false)
				}
			},
			okBtn: {
				text: 'Ok',
				onTap: () => {
					props.onClose(true)
				}
			}
		}} />
	}
}

export default Popup


{/* <Popup.alert
	title={<Text>Wow</Text>}
	open={testPopup}
	close={_ => setTestPopup(false)}
	onClose={result => console.log(result)}
>
	<Text>Testing</Text>
</Popup.alert>
<Button onPress={_ => setTestPopup(true)}>
	<Text>Press Me! - Alert</Text>
</Button>

<Popup.confirm
	title={<Text>Wow</Text>}
	open={testPopup}
	close={_ => setTestPopup(false)}
	onClose={result => {
		setTestPopup(false)
		console.log(result)
	}}
>
	<Text>Testing</Text>
</Popup.confirm>
<Button onPress={_ => setTestPopup(true)}>
	<Text>Press Me! - Confirm</Text>
</Button> */}