import { StyleSheet, Dimensions } from 'react-native';
import { SizeList } from 'src/styles/size';
import { FontList } from 'src/styles/typography';
import { ColorsList } from 'src/styles/colors';

const { width, height } = Dimensions.get('window')

const HomeStyle = StyleSheet.create({
	container: {
		backgroundColor: ColorsList.authBackground,
		flex: 1
	},
	childContainer: {
		// marginHorizontal: SizeList.base,
	},
	firstChildView: {
		height: 80,
	},
	thirdChildView: {
		height: height / 3,
		borderWidth: 1
	},
	fourthChildView: {
		height: height / 3,
		borderWidth: 1
	},
	wrapChildRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	locationInfo: {
		paddingLeft: 5,
		color: 'white',
		...FontList.subtitleFont
	},
	nameAndLoc: {
		justifyContent: "center",
		alignItems: "center"
	},
	infoCategoryStyle: {
		paddingVertical: 10
	},
	cardWrapper: {
		marginBottom: 10,
		backgroundColor: ColorsList.whiteColor,
		padding: SizeList.padding
	}
})

export default HomeStyle