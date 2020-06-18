import React, { useState, useEffect, cloneElement } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
const Gallery = ({
	data,
	renderItem,
	numColumns,
	style,
	rowStyle
}) => {
	const generateData = data => {
		let index = -1
		return data.reduce((arr, a, i) => {
			if (i % numColumns == 0) {
				index++
				arr.push([a])
			} else {
				arr[index].push(a)
			}
			return arr
		}, [])
	}
	const render = (arr, i) => {
		return <View style={{ flexDirection: 'row', ...rowStyle }}>
			{arr.rMap((item, i) => {
				const render = renderItem({ item, i, index: i })
				return cloneElement(render, {
					style: { flex: 1, ...render.props.style }
				})
			})}
		</View>
	}
	return <View style={style}>
		{generateData(data).rMap(render)}
	</View>
}

Gallery.defaultProps = {
	data: [],
	numColumns: 1
}

Gallery.propTypes = {
	rowStyle: PropTypes.object,
	style: PropTypes.object,
	data: PropTypes.array.isRequired,
	renderItem: PropTypes.func.isRequired,
	numColumns: PropTypes.number
}

export default Gallery