import React from "react"
import { Switch } from "react-native"
import { ColorsList } from "src/styles/colors"
import PropTypes from "prop-types"

const SwitchButton = props => {
	return (
		<Switch
			thumbColor={props.toggleValue ? "#cd0192" : "grey"}
			trackColor={{ true: ColorsList.primaryColor, false: "grey" }}
			onValueChange={props.handleChangeToggle}
			value={props.toggleValue}
		/>
	)
}
export default SwitchButton

SwitchButton.propTypes = {
	toggleValue: PropTypes.bool,
	handleChangeToggle: PropTypes.func,
}
