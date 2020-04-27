import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const SizeList = {
    width: width,
    height: height,
    border_radius: 5,
    bodyPadding: 15,
    padding: 10
}