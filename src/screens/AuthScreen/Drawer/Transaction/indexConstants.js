const iconImage = {
	3: {
		image: require("src/assets/icons/round-return.png"),
		text: "BATAL",
		color: "danger",
	},
	2: {
		image: require("src/assets/icons/round-exclamation.png"),
		text: "HUTANG",
		color: "warning",
	},
	1: {
		image: require("src/assets/icons/round-check.png"),
		text: "LUNAS",
		color: "success",
	},
}
const filterResult = ({ data, filter, search }) => {
	return data
		.filter(({ status }) => (filter == "all" ? true : status.includes(filter)))
		.filter(({ payment_code }) =>
			payment_code.toLowerCase().includes(search.toLowerCase()),
		)
}
export { iconImage, filterResult }
