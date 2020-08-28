import React, { Component } from "react"
import RBSheet from "react-native-raw-bottom-sheet"
import { View } from "react-native"
import { Text } from "../Text/CustomText"
import { Image } from "../CustomImage"
import ImagePicker from "react-native-image-crop-picker"
import { Button } from "../Button/Button"
import { Wrapper } from "../View/Wrapper"
import { Bottom } from "../View/Bottom"

export const PickerImage = ({ rbRef, close, imageResolve }) => {
	let err = err => console.debug(err)
	const _handleChoosePhoto = isCamera => {
		close()
		if (isCamera) {
			ImagePicker.openCamera({
				compressImageQuality: 0.7,
			}).then(imageResolve, err)
		} else {
			ImagePicker.openPicker({
				compressImageQuality: 0.7,
				mediaType: "image",
			}).then(imageResolve, err)
		}
	}
	return (
		<RBSheet
			ref={rbRef}
			duration={500}
			animationType="slide"
			customStyles={{
				container: {
					height: 100,
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10,
				},
			}}>
			<Bottom>
				<View>
					<Text style={{ textAlign: "center", marginBottom: 10 }}>
						Pilih gambar
					</Text>
					<Wrapper style={{ width: "100%" }}>
						<Button onPress={() => _handleChoosePhoto(true)}>
							<Image
								size={20}
								source={require("src/assets/icons/camera.png")}
							/>
							<Text color="whiteColor">Camera</Text>
						</Button>
						<Button onPress={() => _handleChoosePhoto()}>
							<Image
								size={20}
								source={require("src/assets/icons/gallery.png")}
							/>
							<Text color="whiteColor">Gallery</Text>
						</Button>
					</Wrapper>
				</View>
			</Bottom>
		</RBSheet>
	)
}
