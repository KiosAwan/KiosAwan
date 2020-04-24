import React from 'react';
import { StyleSheet, Text, Image, View, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage'
import LinearGradient from 'react-native-linear-gradient'

import Strings from '../../utils/Strings'
import BarStatus from '../../components/BarStatus';
import { ColorsList } from 'src/styles/colors';


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
        return (
            <LinearGradient
                style={styles.mainContent}
                colors={[ColorsList.primary, ColorsList.gradientPrimary]}
                start={{ x: 0, y: 0.1 }}
                end={{ x: 0.1, y: 1 }}
            >
                <BarStatus />
                <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                    <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
                </View>
                <View style={{ alignItems: "center", flex: 9 }}>
                    <Image source={item.item.image} style={styles.image} />
                    <View style={{ width: '80%', alignItems: "center", marginBottom: 20 }}>
                        <Text style={styles.title}>{item.item.title}</Text>
                        <Text style={styles.text}>{item.item.text}</Text>
                    </View>
                </View>
            </LinearGradient>
        );
    }

    _renderSkipButton = () => {
        return (
            <View style={{ alignSelf: 'center', padding: 12 }}>
                <Text style={{ fontFamily: 'Nunito-black', fontSize: 14, color: 'white' }}>Lewati</Text>
            </View>
        )
    }

    _renderDoneButton = () => {
        return (
            <View style={{ alignSelf: 'center', padding: 12 }}>
                <Text style={{ fontFamily: 'Nunito-black', fontSize: 14, color: 'white' }}>Mulai</Text>
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
                dotStyle={{ backgroundColor: ColorsList.primary }}
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
        marginTop: 10,
        width: 350,
        height: height * 4 / 9,
    },
    text: {
        color: 'white',
        fontSize: 13,
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
        fontFamily: 'Nunito-black'
    },
    title: {
        fontSize: 18,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'Nunito-ExtraBold'
    },
    logo: {
        height: 90,
        width: 160,
    }
});