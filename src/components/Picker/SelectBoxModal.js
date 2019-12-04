import { Item, Input, Icon, Label, Card, CardItem } from 'native-base';
import { View, Modal, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';

export const MyModal = (props) => {
	return (
		<Modal
			style={[{}, props.style]}
			animationType="slide"
			transparent={true}
			visible={props.visible}
			onRequestClose={props.onClose}>
			<TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,.5)', width: '100%', height: '100%' }} disabled={props.backdropDismiss ? false : true} onPress={props.backdropDismiss}>
				<View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
					<Card styles={{ paddingVertical: 40, paddingHorizontal: 20 }}>
						{props.body}
					</Card>
				</View>
			</TouchableOpacity>
		</Modal>
	)
}

export const SelectBoxModal = (props) => {
	const [activeColor, setActiveColor] = useState('grey');
	const [modalVisible, setModalVisible] = useState(false);
	return (
		<View>
			<MyModal visible={modalVisible} backdropDismiss={() => setModalVisible(false)} body={
				[props.header ? <CardItem header>
					{props.header}
				</CardItem> : null,
				<ScrollView style={{ height: 300 }}>{
					props.data.map((item) => {
						return (
							<CardItem style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} button onPress={() => {
								props.handleChangePicker(item)
								props.closeOnSelect ? setModalVisible(false) : null
							}}>
								{props.renderItem(item)}
							</CardItem>
						)
					})
				}
				</ScrollView>,
				props.footer ?
					<CardItem footer>
						{props.footer}
					</CardItem> : null
				]
			} />
			<Item onPress={() => setModalVisible(true)} success floatingLabel style={[{ width: '100%', borderColor: activeColor }, props.style]}>
				<Label style={{ color: activeColor, padding: 0, margin: 0 }}>{props.label}</Label>
				<Input
					onFocus={() => setActiveColor('#cd0192')}
					onBlur={() => setActiveColor('grey')}
					disabled={true}
					value={props.value}
					style={{ margin: 0, padding: 0, color: activeColor }}
				/>
				<Icon name='arrow-dropdown' style={{ color: 'black' }} />
			</Item>
		</View >
	);
}