import SearchInput from '../Input/SearchInput'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { View, Image, StyleSheet, Dimensions } from 'react-native'
import { Header as HeaderNB } from 'native-base'
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { Text } from '../Text/CustomText'
import { ColorsList } from 'src/styles/colors'
import { Button } from '../Button/Button'
import { Wrapper } from '../View/Wrapper'
import BarStatus from '../BarStatus'
import Icon from 'react-native-vector-icons/FontAwesome5'
const width = Dimensions.get('window').width

export const Header = props => {
    const { title, onPressLeft, onPressRight, iconLeft, iconRight, color, children } = props
    return <View>
        <BarStatus />
        <Wrapper justify="space-between">
            <Button onPress={onPressLeft} color={['transparent']}>
                <Icon color={color || ColorsList.greyFont} size={20} name={iconLeft || "arrow-left"} />
            </Button>
            {
                title ? <Text style={{ width: '75%' }} align="left">{title}</Text> :
                    <View>
                        {children}
                    </View>
            }
            <Button onPress={onPressRight} color={['transparent']}>
                <Icon color={color || ColorsList.greyFont} size={20} name={iconRight || "ellipsis-v"} />
            </Button>
        </Wrapper>
    </View>
}

export const HeaderRegister = (props) => {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: "center",
            justifyContent: 'space-between',
            paddingTop: 10
        }}>
            <Image style={{ width: 160, height: 90 }} source={require('src/assets/images/logo.png')} />
        </View>
    )
}

export const HomeHeader = props => {
    return <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={{ height: props.height || 170, justifyContent: "center" }}>
        <BarStatus />
        <Wrapper justify="space-between" style={{ padding: 15, paddingTop: 0 }}>
            <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity onPress={props.onPressMenu}>
                    <Icon color="white" size={20} name="bars" />
                </TouchableOpacity>
            </View>
            {props.center ? props.center : <Image style={{ width: 150, height: 80 }} source={require('src/assets/images/logo.png')} />}
            <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity>
                    <Icon color="white" size={20} name="bell" />
                </TouchableOpacity>
            </View>
        </Wrapper>
        {props.children}
    </LinearGradient>
}

export const GlobalHeader = (props) => {
    return (
        <HeaderNB androidStatusBarColor="#cd0192" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                        <View />
                    </View>
                </Wrapper>
            </LinearGradient>
        </HeaderNB>
    )
}

export const GlobalHeaderWithIcon = (props) => {
    return (
        <HeaderNB androidStatusBarColor="#cd0192" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <LinearGradient colors={['#cd0192', '#6d1d6d']} style={{ width: '100%', justifyContent: 'center' }}>
                {
                    props.onlyTitle ?
                        <Wrapper style={{}}>
                            <Text color="whiteColor" size={15} font="Bold">{props.title}</Text>
                        </Wrapper>
                        :
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
                                <TouchableOpacity onPress={props.handleDeleteCategory || props.handlePressIcon || props.onPressIcon}>
                                    <Image style={{ width: 30, height: 30 }} source={props.image} />
                                </TouchableOpacity>
                            </View>
                        </Wrapper>
                }
            </LinearGradient>
        </HeaderNB>
    )
}

export const CashierHeader = props => {
    const [focus, setFocus] = useState(false)
    return (
        <HeaderNB androidStatusBarColor="#cd0192" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <LinearGradient colors={['#cd0192', '#6d1d6d']} style={{ width: '100%' }}>
                <Wrapper justify="space-between" style={{ height: '100%', alignSelf: focus ? "center" : null }}>
                    <Wrapper _width={!focus ? "85%" : "95%"}>
                        {!focus ?
                            <Button padding={7} onPress={props.onPressBack} color="link" style={{ paddingHorizontal: 15, marginRight: 10 }}>
                                <Icon name="arrow-left" size={20} color="white" />
                            </Button>
                            : <View style={{ width: 1 }} />
                        }
                        <SearchInput _width={!focus ? "90%" : "100%"} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} clear={props.clear} icon={require('src/assets/icons/circlerejectwhite.png')} clear={props.clear} color={ColorsList.whiteColor} blurColor="transparent">
                            <TextInput style={{ color: ColorsList.whiteColor }} placeholderTextColor={ColorsList.authBackground} value={props.value} onChangeText={props.handleChangeText} placeholder="Cari produk..." />
                        </SearchInput>
                    </Wrapper>
                    {!focus ?
                        <Wrapper _width="10%">
                            <TouchableOpacity onPress={props.onPressMenu}>
                                <Icon name="ellipsis-v" size={20} color="white" />
                            </TouchableOpacity>
                        </Wrapper>
                        : <View style={{ width: 1 }} />
                    }
                </Wrapper>
            </LinearGradient>
        </HeaderNB>
    )
}
