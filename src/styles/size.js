import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export const SizeList = {
    width: width,
    height: height,
    borderRadius: 5,
    borderWidth: 1,
    bodyPadding: 20,
    padding: 15,
    radius: 5,
    elevation: 1,
    base: 10,
    secondary: 5
}