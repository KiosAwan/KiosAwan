import React, { Component } from 'react';
import { View } from 'react-native';
export const Wrapper = props => {
	const { noWrapper, children, radius, flexStart, flexEnd, center, spaceBetween, spaceAround } = props
	if (props.noWrapper) {
		// console.debug(987654)
	}
	return <View style={[{
		flexDirection: props.direction || 'row',
		justifyContent: props.justify || 'space-around',
	},
	radius && { borderRadius: 5 },
	flexStart && { justifyContent: 'flex-start' },
	flexEnd && { justifyContent: 'flex-end' },
	center && { justifyContent: 'center' },
	spaceAround && { justifyContent: 'space-around' },
	spaceBetween && { justifyContent: 'space-between' },
	props.style]}>
		{
			children.length > 0 ?
				children.map((item, i) => {
					const itemCLoned = React.cloneElement(item, {
						// style: [item.style]//, item.props.style && item.props.style.width ? { width: '100%' } : {}]
					})
					return <View style={[
						{
							width: item.props._width,
							justifyContent: item.props._justify || 'center'
						},
						item.props.flex && { flex: 1 },
						item.props._style,
						item.props.style && item.props.style.width ? { width: item.props.style.width } : {},
						item.props.width ? { width: item.props.width } : {},
						item.props._style,
					]} key={i}>
						{itemCLoned}
					</View>
				}) : (children)
		}
	</View>
}