import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
export const Wrapper = props => {
	const { onPress, noWrapper, children, radius, flexStart, flexEnd, center, spaceBetween, spaceAround } = props
	if (props.noWrapper) {
		// console.debug(987654)
	}
	return <TouchableOpacity onPress={onPress} activeOpacity={onPress ? .5 : 1} style={[{
		flexDirection: props.direction || 'row',
		justifyContent: props.justify || 'space-around',
	},
	radius && { borderRadius: 5 },
	flexStart && { justifyContent: 'flex-start' },
	flexEnd && { justifyContent: 'flex-end' },
	center && { justifyContent: 'center' },
	spaceAround && { justifyContent: 'space-around' },
	spaceBetween && { justifyContent: 'space-between' },
	props.shadow && { elevation: 1, borderRadius: 10 },
	props.style]}>
		{
			children.length > 0 ?
				children.rMap((item, i) => {
					if (!item) return null
					const itemCLoned = React.cloneElement(item, {})
					return noWrapper ? itemCLoned : <View style={[
						{ width: item.props._width, justifyContent: item.props._justify || 'center' },
						item.props._flexStart && { justifyContent: 'flex-start' },
						item.props._flexEnd && { justifyContent: 'flex-end' },
						item.props._center && { justifyContent: 'center' },
						item.props._spaceAround && { justifyContent: 'space-around' },
						item.props._spaceBetween && { justifyContent: 'space-between' },
						!item.props._unFlex && props.flexContent && { flex: 1 },
						!item.props._unFlex && item.props._flex && { flex: 1 },
						item.props.style && item.props.style.width ? { width: item.props.style.width } : {},
						item.props.width ? { width: item.props.width } : {},
						item.props._style,
					]} key={i}>
						{itemCLoned}
					</View>
				}) : (children)
		}
	</TouchableOpacity>
}