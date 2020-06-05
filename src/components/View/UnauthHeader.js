import React from 'react';
import { Image, View } from 'react-native';

const UnauthHeader = props => {
	return <View>
		<Image
			style={{ resizeMode: 'contain', width: 100, height: 50, alignSelf: "center" }}
			source={require('src/assets/images/logo.png')}
		/>
	</View>
}

export default UnauthHeader