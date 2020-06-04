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
import { SizeList } from 'src/styles/size';

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
    return <View style={{ justifyContent: "center" }}>
        <BarStatus />
        <Wrapper justify="space-between" style={{ padding: 15 }}>
            {props.center}
            <View style={{ justifyContent: 'center' }}>
                <TouchableOpacity>
                    <Icon color="black" size={20} name="bell" />
                </TouchableOpacity>
            </View>
        </Wrapper>
        {props.children}
    </View>
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
        renderLeftAccessory,
        renderRightAccessory,
        style
    } = props
    const renderMid = () => {
        if (children) {
            return children
        } else {
            if (typeof title == 'string') {
                return <Text font="SemiBold" color={transparent ? titleColor || ColorsList.greyFontHard : ColorsList.greyFontHard}>{title.toUpperCase()}</Text>
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
        {
            typeof renderLeftAccessory == 'function' &&
            <View style={{ paddingRight: SizeList.base }}>{renderLeftAccessory()}</View>
        }
        {!onlyTitle && !renderLeftAccessory && <Button color={["transparent"]} onPress={onPressBack} {...leftProps}>
            <Icon name={iconBack || "arrow-left"} size={20} color={iconColor || ColorsList.greyFont} />
        </Button>}
        <Wrapper _flex style={onlyTitle && { paddingHorizontal: 10 }}>
            {renderMid()}
        </Wrapper>
        {
            (!image || !renderRightAccessory) &&
            <Icon name="arrow-left" size={25} color={ColorsList.transparent} />
        }
        {
            !onlyTitle && image && <Button color={["transparent"]} onPress={handleDeleteCategory || handlePressIcon || onPressIcon} {...rightProps}>
                {renderImage()}
            </Button>
        }
        {
            typeof renderRightAccessory == 'function' &&
            <View style={{ paddingRight: SizeList.base }}>{renderRightAccessory()}</View>
        }
    </Wrapper>
    return <Header androidStatusBarColor={ColorsList.greyAuthHard} style={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent', elevation: 0 }}>
        {
            transparent ?
                <View style={{ width: '100%', justifyContent: 'center', ...style }}>
                    {render()}
                </View> :
                <View style={{ backgroundColor: ColorsList.authBackground, width: '100%', justifyContent: 'center', ...style }}>
                    {render()}
                </View>
        }
    </Header>
}

export const IconHeader = props => {
    const { onPress, ..._props } = props
    return <TouchableOpacity onPress={onPress}>
        <Icon color={ColorsList.secondary} {..._props} size={20} />
    </TouchableOpacity>
}
export const ImageHeader = props => <Image {...props} style={{ width: 30, height: 30 }} />

export const CashierHeader = props => {
    const [focus, setFocus] = useState(false)
    return <GlobalHeader {...props} onlyTitle={focus} image={<Icon name="ellipsis-v" size={20} color="white" />}>
        <SearchInput onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} clear={props.clear} icon={require('src/assets/icons/circlerejectwhite.png')} clear={props.clear} color={ColorsList.whiteColor} blurColor="transparent">
            <TextInput style={{ color: ColorsList.black }} placeholderTextColor={ColorsList.greyFont} value={props.value} onChangeText={props.handleChangeText} placeholder="Cari produk..." />
        </SearchInput>
    </GlobalHeader>
}
