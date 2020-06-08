import React from 'react';
import { StyleSheet, Image, View, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage'
import Strings from '../../utils/Strings'
import BarStatus from '../../components/BarStatus';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import Container from 'src/components/View/Container';
import UnauthHeader from 'src/components/View/UnauthHeader';


const slides = [
    {
        key: 'somethun',
        title: Strings.INTRO1TITLE,
        text: Strings.INTRO1SUBTITLE,
        image: require('../../assets/images/intro1.png'),
    },
    {
        key: 'somethun-dos',
        title: Strings.INTRO2TITLE,
        text: Strings.INTRO2SUBTITLE,
        image: require('../../assets/images/intro2.png'),
    },
    {
        key: 'somethun1',
        title: Strings.INTRO3TITLE,
        text: Strings.INTRO3SUBTITLE,
        image: require('../../assets/images/intro3.png'),
    }
];

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export default class AppIntro extends React.Component {
    _renderItem = (item) => {
        return <Container style={styles.mainContent}>
            <BarStatus />
            <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                <UnauthHeader />
            </View>
            <View style={{ alignItems: "center", flex: 9 }}>
                <Image source={item.item.image} style={styles.image} />
                <View style={{ width: '90%', alignItems: "center", marginBottom: 20 }}>
                    <Text size={15} align="center" color="primary">{item.item.title}</Text>
                    <Text style={{ marginTop: 10 }} align="center" font="semiBold">{item.item.text}</Text>
                </View>
            </View>
        </Container>
    }

    _renderSkipButton = () => {
        return (
            <View style={{ alignSelf: 'center', padding: 12 }}>
                <Text color="primary">Lewati</Text>
            </View>
        )
    }

    _renderDoneButton = () => {
        return (
            <View style={{ alignSelf: 'center', padding: 12 }}>
                <Text color="primary">Mulai</Text>
            </View>
        )
    }

    _onSkip = async () => {
        await AsyncStorage.setItem("introApp", "sudah")
        this.props.navigation.navigate('/unauth')
    }
    _onDone = async () => {
        await AsyncStorage.setItem("introApp", "sudah")
        this.props.navigation.navigate('/unauth')
    }
    render() {
        return (
            <AppIntroSlider
                dotStyle={{ backgroundColor: ColorsList.greySoft }}
                activeDotStyle={{ backgroundColor: ColorsList.primary }}
                renderItem={this._renderItem}
                slides={slides}
                onDone={this._onDone}
                renderDoneButton={this._renderDoneButton}
                showSkipButton
                renderSkipButton={this._renderSkipButton}
                onSkip={this._onSkip}
                showNextButton={false}
            />
        )
    }
}

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image: {
        resizeMode: 'contain',
        marginTop: 10,
        width: 350,
        height: height * 4 / 9,
    },
    logo: {
        height: 50,
        width: 100,
    }
});