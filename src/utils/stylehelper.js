const getShortHand = (style, ...values) => {
	if (values.length === 1) {
		return { [style]: values[0] }
	}
	const _genCss = (...values) => ({
		[`${style}Top`]: values[0],
		[`${style}Right`]: values[1],
		[`${style}Bottom`]: values[2],
		[`${style}Left`]: values[3],
	})
	if (values.length === 2) {
		return _genCss(values[0], values[1], values[0], values[1])
	}
	if (values.length === 3) {
		return _genCss(values[0], values[1], values[2], values[1])
	}
	return _genCss(values[0], values[1], values[2], values[3])
}

const border = (color, style, ...sizes) => {
	const _genCss = (...sizes) => {
		let styles = {
			borderColor: color
		}, direction = color ? ['Top', 'Right', 'Bottom', 'Left'] : ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft']
		direction.forEach((dir, i) => {
			styles[`border${dir}${style}`] = sizes[i]
		})
		return styles
	}
	if (sizes.length === 1) {
		return _genCss(sizes[0], sizes[0], sizes[0], sizes[0])
	}
	if (sizes.length === 2) {
		return _genCss(sizes[0], sizes[1], sizes[0], sizes[1])
	}
	if (sizes.length === 3) {
		return _genCss(sizes[0], sizes[1], sizes[2], sizes[1])
	}
	return _genCss(sizes[0], sizes[1], sizes[2], sizes[3])
}

export const $Border = (color, ...sizes) => border(color, 'Width', ...sizes)
export const $BorderRadius = (...sizes) => border(undefined, 'Radius', ...sizes)
export const $Padding = (...values) => getShortHand('padding', ...values)
export const $Margin = (...values) => getShortHand('margin', ...values)