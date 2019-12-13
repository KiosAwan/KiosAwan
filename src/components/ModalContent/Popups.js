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





















const Popup = props => {
	const styles = StyleSheet.create({
		touchableStyle: {
			width: '100%',
			height: '100%',
			alignItems: "center",
			justifyContent: 'center',
			backgroundColor: 'rgba(0,0,0,.5)'
		},
		wrapView: {
			padding: 20,
			alignItems: "center",
			backgroundColor: 'white',
			borderRadius: 5
		}
	})
	return <Modal
		animationType="fade"
		transparent={true}
		visible={props.visible}
		onRequestClose={props.onClose}
	>
		<TouchableOpacity activeOpacity={.5} disabled={!props.backdropDismiss} onPress={props.backDropClick} style={styles.touchableStyle}>
			<View style={styles.wrapView}>
				<Button onPress={() => _setVisible(!_visible)}>
					<Text>Ok</Text>
				</Button>
			</View>
		</TouchableOpacity>
	</Modal>
}

// const [_visible, _setVisible] = useState(false)

// <Popup backdropDismiss={true} visible={_visible} backDropClick={()=>_setVisible(false)}>
// 				<Text>Test</Text>
// 			</Popup>