import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import { Header } from 'native-base'
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { Text } from '../Text/CustomText'
import BarStatus from '../BarStatus';
import { ColorsList } from 'src/styles/colors'
import { Button } from '../Button/Button'
import { Wrapper } from '../View/Wrapper'


const width = Dimensions.get('window').width

export const HeaderRegister = (props) => {
    return (
        <View style={styles.HeaderRegisterWrap}>
            <Image style={{ width: 160, height: 90 }} source={require('../../assets/images/logo.png')} />
        </View>
    )
}

export const HomeHeader = props => {
    return [
        <BarStatus />,
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={{ height: props.height || 80 }}>
            <Wrapper justify="space-between" style={{ padding: 15, paddingTop: 0 }}>
                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity onPress={props.onPressMenu}>
                        <Icon color="white" size={20} name="bars" />
                    </TouchableOpacity>
                </View>
                {props.children ? props.children : <Image style={{ width: 150, height: 80 }} source={require('src/assets/images/logo.png')} />}
                <View style={{ justifyContent: 'center' }}>
                    <TouchableOpacity>
                        <Icon color="white" size={20} name="bell" />
                    </TouchableOpacity>
                </View>
            </Wrapper>
        </LinearGradient>
    ]
}

export const GlobalHeader = (props) => {
    return (
        <Header androidStatusBarColor="#cd0192" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <LinearGradient colors={['#cd0192', '#6d1d6d']} style={{ width: '100%', ...props.style }}>
                <Wrapper justify="space-between" style={{ height: '100%' }}>
                    <View style={{ justifyContent: 'flex-start', marginTop: 5 }}>
                        <Wrapper>
                            <Button padding={7} onPress={props.onPressBack} color="link" style={{ paddingHorizontal: 15, marginRight: 10 }}>
                                <Icon name="arrow-left" size={20} color="white" />
                            </Button>
                            <View style={{ justifyContent: 'center' }}>
                                <Text color="whiteColor">{props.title}</Text>
                            </View>
                        </Wrapper>
                        <View></View>
                    </View>
                </Wrapper>
            </LinearGradient>
        </Header>
    )
}

export const GlobalHeaderWithIcon = (props) => {
    return (
        <Header androidStatusBarColor="#cd0192" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <LinearGradient colors={['#cd0192', '#6d1d6d']} style={{ width: '100%' }}>
                <Wrapper justify="space-between" style={{ height: '100%' }}>
                    <Wrapper>
                        <Button padding={7} onPress={props.onPressBack} color="link" style={{ paddingHorizontal: 15, marginRight: 10 }}>
                            <Icon name="arrow-left" size={20} color="white" />
                        </Button>
                        <View style={{ justifyContent: 'center' }}>
                            <Text color="whiteColor">{props.title}</Text>
                        </View>
                    </Wrapper>
                    <View style={{ justifyContent: 'center', paddingRight: 15 }}>
                        <TouchableOpacity onPress={props.handleDeleteCategory || props.handlePressIcon}>
                            <Image style={{ width: 30, height: 30 }} source={props.image} />
                        </TouchableOpacity>
                    </View>
                </Wrapper>
            </LinearGradient>
        </Header>
    )
}

export const CashierHeader = (props) => {
    return (
        <Header androidStatusBarColor="#cd0192" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <LinearGradient colors={['#cd0192', '#6d1d6d']} style={{ width: '100%' }}>
                <Wrapper justify="space-between" style={{ height: '100%' }}>
                    <Wrapper>
                        <Button padding={7} onPress={props.onPressBack} color="link" style={{ paddingHorizontal: 15, marginRight: 10 }}>
                            <Icon name="arrow-left" size={20} color="white" />
                        </Button>
                        <TextInput style={{ color: ColorsList.whiteColor }} placeholderTextColor={ColorsList.whitePlaceholder} onChangeText={props.handleChangeText} placeholder="Cari produk" />
                    </Wrapper>
                    <View style={{ justifyContent: 'center', paddingRight: 15 }}>
                        <TouchableOpacity onPress={props.onPressMenu}>
                            <Icon name="ellipsis-v" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </Wrapper>
            </LinearGradient>
        </Header>
    )
}


const styles = StyleSheet.create({
    HeaderRegisterWrap: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        paddingTop: 10
    },
    headerGlobal: {
        alignItems: "center",
    },
    linearHeader: {
        width,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})