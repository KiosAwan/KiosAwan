import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const SizeList = {
    width: width,
    height: height,
    borderRadius: 5,
    bodyPadding: 15,
    padding: 10,
    radius: 5
}