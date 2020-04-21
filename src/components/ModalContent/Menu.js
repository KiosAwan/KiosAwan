import React, { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { View } from 'react-native';
const Menu = props => {
	const { visible, state, data, renderItem, bgColor, onSelect, position, style, width } = props
	const positionStyle = () => {
		switch (position) {
			case 'topLeft': return {
				wrapper: {
					alignItems: 'flex-start'
				}
			}
			case 'topRight': return {
				wrapper: {
					alignItems: 'flex-end'
				}
			}
			case 'bottomLeft': return {
				wrapper: {
					justifyContent: 'flex-end',
					alignItems: 'flex-start'
				}
			}
			case 'bottomRight': return {
				wrapper: {
					justifyContent: 'flex-end',
					alignItems: 'flex-end'
				}
			}
			default: return {
				wrapper: {
					justifyContent: 'center'
				},
				content: {
					justifyContent: 'center',
				}
			}
		}
	}
	const [_style, setStyle] = useState({})
	useEffect(() => {
		setStyle(positionStyle())
	}, [])
	return visible && <Button
		wrapper={{ direction: 'column' }}
		onPress={() => state(false)}
		color={[bgColor || 'blackTransparent']} style={{
			position: 'absolute',
			zIndex: 10,
			width: '100%',
			height: '100%',
			..._style.wrapper
		}} activeOpacity={1} noRadius noBorder>
		<View style={{
			width,
			..._style.content,
			...style
		}}>
			{
				data.map((item, i) => <Button color={props.menuColor} onPress={() => {
					state(false)
					onSelect({ item, index: i })
				}}
					key={i.toString()}>
					{renderItem(item, i)}
				</Button>)
			}
		</View>
	</Button>
}

export default Menu