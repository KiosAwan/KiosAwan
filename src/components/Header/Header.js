import SearchInput from '../Input/SearchInput'
import React, { useState, cloneElement } from 'react'
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
import { Input } from '../Input/MDInput';

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
        style,
        title = "",
        renderLeftAccessory = () => {
            return !onlyTitle && <Button color="link" flexStart padding={0} onPress={onPressBack} {...leftProps}>
                <Icon name={iconBack || "arrow-left"} size={20} color={iconColor || ColorsList.greyFont} />
            </Button>
        },
        renderRightAccessory = () => {
            return !onlyTitle && <Button color="link" flexEnd padding={0} onPress={handleDeleteCategory || handlePressIcon || onPressIcon} {...rightProps}>
                {renderImage()}
            </Button>
        }
    } = props
    const renderMid = () => {
        if (children) {
            return <View _flex>
                {children}
            </View>
        } else {
            if (typeof title == 'string') {
                return <Text _flex align="center" font="SemiBold" color={transparent ? titleColor || ColorsList.greyFontHard : ColorsList.greyFontHard}>{title.toUpperCase()}</Text>
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
            return <Image style={{ width: 20, height: 20 }} source={image} />
        }
    }
    const render = () => <Wrapper style={{ paddingHorizontal: SizeList.bodyPadding, width: '100%', ...style }} spaceBetween={!onlyTitle}>
        {renderLeftAccessory()}
        {renderMid()}
        {renderRightAccessory()}
    </Wrapper>
    return <Header androidStatusBarColor={ColorsList.greyAuthHard} style={{ paddingLeft: 0, paddingRight: 0, backgroundColor: 'transparent', elevation: 0 }}>
        {render()}
    </Header>
}

export const IconHeader = props => {
    const { onPress, disabled, ..._props } = props
    return <TouchableOpacity disabled={disabled} onPress={onPress}>
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

export const SearchHeader = _props => {
    const {
        title,
        label,
        search,
        onChangeText,
        onPressIcon = () => null,
        ...props
    } = _props
    const [active, setActive] = useState(false)
    return <GlobalHeader
        title={title}
        renderRightAccessory={() => <Button onPress={() => {
            setActive(!active)
            onPressIcon()
        }} color="link" padding={0}>
            <Icon size={active ? 17 : 20} style={{ color: ColorsList.greyFont }} name={active ? "times-circle" : "search"} />
        </Button>}
        {...props}
    >
        {
            active && <Input
                transparent
                noLabel
                autoFocus
                label={label}
                value={search}
                onChangeText={onChangeText}
                inputStyle={{ textAlign: "center" }}
            />
        }
    </GlobalHeader>
}