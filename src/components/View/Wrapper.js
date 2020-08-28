import React from "react"
import { View, ViewPropTypes } from "react-native"
import { ColorsList } from "src/styles/colors"
import { SizeList } from "src/styles/size"
import PropTypes from "prop-types"

export const Wrapper = _props => {
	const {
		noWrapper,
		children,
		radius,
		flexStart,
		flexEnd,
		center,
		spaceBetween,
		spaceAround,
		direction,
		justify,
		flexContent,
		shadow,
		style,
	} = _props
	return (
		<View
			style={[
				{
					flexDirection: direction || "row",
					justifyContent: justify || "space-around",
				},
				radius && { borderRadius: 5 },
				flexStart && { justifyContent: "flex-start" },
				flexEnd && { justifyContent: "flex-end" },
				center && { justifyContent: "center" },
				spaceAround && { justifyContent: "space-around" },
				spaceBetween && { justifyContent: "space-between" },
				shadow && {
					borderRadius: 5,
					borderWidth: SizeList.borderWidth,
					borderColor: ColorsList.borderColor,
				},
				style,
			]}>
			{children.length > 0
				? children.rMap((item, i) => {
						if (!item) return null
						const itemCLoned = React.cloneElement(item, {})
						const props = item.props
						return noWrapper ? (
							itemCLoned
						) : (
							<View
								style={[
									{
										width: props._width,
										justifyContent: props._justify || "center",
									},
									props._flexStart && { justifyContent: "flex-start" },
									props._flexEnd && { justifyContent: "flex-end" },
									props._center && { justifyContent: "center" },
									props._spaceAround && { justifyContent: "space-around" },
									props._spaceBetween && { justifyContent: "space-between" },
									!props._unFlex && flexContent && { flex: 1 },
									!props._unFlex && props._flex && { flex: 1 },
									props.style && props.style.width
										? { width: props.style.width }
										: {},
									props.width ? { width: props.width } : {},
									props._style,
								]}
								key={i}>
								{itemCLoned}
							</View>
						)
				  })
				: children}
		</View>
	)
}

Wrapper.propTypes = {
	noWrapper: PropTypes.bool,
	radius: PropTypes.number,
	flexStart: PropTypes.bool,
	flexEnd: PropTypes.bool,
	center: PropTypes.bool,
	spaceBetween: PropTypes.bool,
	spaceAround: PropTypes.bool,
	direction: PropTypes.oneOf(["row", "column"]),
	justify: PropTypes.oneOf([
		"space-evenly",
		"flex-start",
		"flex-end",
		"center",
		"space-between",
		"space-around",
	]),
	flexContent: PropTypes.bool,
	shadow: PropTypes.bool,
	style: ViewPropTypes.style,
	children: PropTypes.any,
}
