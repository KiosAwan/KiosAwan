import React, { Component } from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Bottom, Wrapper, Button } from '../Button/ButtonComp';
import { View } from 'react-native';
import { Text } from '../Text/CustomText';
import { Image } from '../CustomImage';
import ImagePicker from 'react-native-image-crop-picker'

export const PickerImage = props => {
	let err = err => console.debug(err)
	const _handleChoosePhoto = (isCamera) => {
		props.close()
		if (isCamera) {
			ImagePicker.openCamera({
				width: 300,
				height: 300,
				cropping: true
			}).then(props.imageResolve, err);
		} else {
			ImagePicker.openPicker({
				mediaType: 'image'
			}).then(props.imageResolve, err);
		}
	}
	return <RBSheet
		ref={props.rbRef}
		duration={500}
		animationType="slide"
		customStyles={{
			container: {
				height: 100,
				borderTopLeftRadius: 10,
				borderTopRightRadius: 10
			},
		}}
	>
		<Bottom>
			<View>
				<Text style={{ textAlign: 'center', marginBottom: 10 }}>Pilih gambar</Text>
				<Wrapper style={{ width: '100%' }}>
					<Button onPress={() => _handleChoosePhoto(true)}>
						<Image size={20} source={require('src/assets/icons/camera.png')} />
						<Text color="whiteColor">Camera</Text>
					</Button>
					<Button onPress={() => _handleChoosePhoto()}>
						<Image size={20} source={require('src/assets/icons/gallery.png')} />
						<Text color="whiteColor">Gallery</Text>
					</Button>
				</Wrapper>
			</View>
		</Bottom>
	</RBSheet>
}