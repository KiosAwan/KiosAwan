import SearchInput from '../Input/SearchInput'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/FontAwesome5'
import BarStatus from '../BarStatus';
import { Wrapper } from '../View/Wrapper'
import { View, Image } from 'react-native'
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler'
import { Text } from '../Text/CustomText'
import { Header } from 'native-base'
import { ColorsList } from 'src/styles/colors'
import { Button } from '../Button/Button'

export const HeaderRegister = () => {
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

export const GlobalHeaderWithIcon = props => {
    return <GlobalHeader {...props} />
}

export const GlobalHeader = props => {
    const {
        title,
        iconBack,
        iconColor,
        titleColor,
        onPressBack,
        handleDeleteCategory,
        handlePressIcon,
        onPressIcon,
        image,
        transparent,
        onlyTitle,
        children,
        leftProps,
        rightProps,
        style
    } = props
    const renderMid = () => {
        if (children) {
            return children
        } else {
            if (typeof title == 'string') {
                return <Text color={transparent ? titleColor || 'white' : 'white'}>{title}</Text>
            }
        }
    }
    const renderImage = () => {
        try {
            if (['number'].includes(typeof image)) {
                throw new Error()
            }
            return image
        } catch (err) {
            return <Image style={{ width: 30, height: 30 }} source={image} />
        }
    }
    const render = () => <Wrapper spaceBetween={!onlyTitle}>
        {!onlyTitle && <Button color={["transparent"]} onPress={onPressBack} {...leftProps}>
            <Icon name={iconBack || "arrow-left"} size={20} color={iconColor || "white"} />
        </Button>}
        <View _flex style={onlyTitle && { paddingHorizontal: 10 }}>
            {renderMid()}
        </View>
        {
            !onlyTitle && image && <Button color={["transparent"]} onPress={handleDeleteCategory || handlePressIcon || onPressIcon} {...rightProps}>
                {renderImage()}
            </Button>
        }
    </Wrapper >
    return <Header androidStatusBarColor={ColorsList.primary} style={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent', elevation: 0 }}>
        {
            transparent ?
                <View style={{ width: '100%', justifyContent: 'center', ...style }}>
                    {render()}
                </View> :
                <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={{ width: '100%', justifyContent: 'center', ...style }}>
                    {render()}
                </LinearGradient>
        }
    </Header>
}

export const CashierHeader = props => {
    const [focus, setFocus] = useState(false)
    return <GlobalHeader {...props} onlyTitle={focus} image={<Icon name="ellipsis-v" size={20} color="white" />}>
        <SearchInput onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} clear={props.clear} icon={require('src/assets/icons/circlerejectwhite.png')} clear={props.clear} color={ColorsList.whiteColor} blurColor="transparent">
            <TextInput style={{ color: ColorsList.whiteColor }} placeholderTextColor={ColorsList.authBackground} value={props.value} onChangeText={props.handleChangeText} placeholder="Cari produk..." />
        </SearchInput>
    </GlobalHeader>
}
