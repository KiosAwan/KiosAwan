import React, { useState, useEffect } from 'react'
import { TextField } from "react-native-material-textfield"
import { ColorsList } from 'src/styles/colors'
import { Button } from '../Button/Button'
import { Icon } from 'native-base'
import { Image } from '../CustomImage'
import { Animated, View } from 'react-native'
import { FontName } from 'src/styles/typography'

const MDInput = props => {
	const { renderLeftAccessory, renderRightAccessory } = props
	const _render = (render, isRight) => render && [
		isRight && <View style={{ padding: 5 }} />,
		render(),
		!isRight && <View style={{ padding: 5 }} />
	]
	return <TextField
		{...props}
		fontSize={13}
		tintColor={ColorsList.primary}
		textColor={ColorsList.text}
		baseColor={ColorsList.secondary}
		renderRightAccessory={() => _render(renderRightAccessory, true)}
		renderLeftAccessory={() => _render(renderLeftAccessory)}
		style={{ fontFamily: FontName.Regular, ...props.style }}
	/>
}


const MDInputV2 = props => {
	const [visible, setVisible] = useState({
		left: true,
		right: true
	})
	const { onPressLeft, onPressRight, focusLeft, focusRight } = props
	const left = () => {
		const btn = <Button color="link" onPress={onPressLeft} disabled={!onPressLeft}>
			<Icon _width="10%" size={15} style={{ color: ColorsList.primary }} name="search" />
		</Button>
		if (focusLeft) {
			if (visible.left) {
				return btn
			} else {
				return null
			}
		}
		return btn
	}
	const right = () => {
		const btn = <Button color="link" onPress={onPressRight} disabled={!onPressRight}>
			<Image style={{ width: 20, height: 20 }} source={require('src/assets/icons/circlereject.png')} />
		</Button>
		if (focusRight) {
			if (visible.right) {
				return btn
			} else {
				return null
			}
		}
		return btn
	}
	const focus = () => {
		console.debug(typeof leftRef.layout.width, leftRef.layout.width)
		Animated.timing(LeftValue, {
			toValue: leftRef.layout.width,
			duration: 1000
		}).start()
	}
	// setVisible({ left: true, right: true })
	const blur = () => Animated.timing(LeftValue, {
		toValue: 0,
		duration: 1000
	}).start()
	// setVisible({ left: false, right: false })
	useEffect(() => {
		if (focusLeft) setVisible({ ...visible, left: false })
		if (focusRight) setVisible({ ...visible, right: false })
	}, [])
	const LeftValue = new Animated.Value(0)
	const [leftRef, setLeftRef] = useState()
	const _style = () => {
		console.debug(LeftValue._value > 0)
		//  && { width: LeftValue }
	}
	return <MDInput
		renderLeftAccessory={() => <Animated.View onLayout={({ nativeEvent }) => setLeftRef(nativeEvent)} style={_style()}>
			<Button color="link" onPress={onPressLeft} disabled={!onPressLeft}>
				<Icon _width="10%" size={15} style={{ color: ColorsList.primary }} name="search" />
			</Button>
		</Animated.View>
		}
		renderRightAccessory={right}
		onFocus={focus}
		onBlur={blur}
		{...props}
	/>
}

export default MDInput
export { MDInputV2 }