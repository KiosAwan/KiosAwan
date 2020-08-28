import { ColorsList } from "./colors"

export const FontName = {
	Bold: "Rubik-Bold",
	ExtraBold: "Nunito-ExtraBold",
	Regular: "SFProDisplay-Regular",
	SemiBold: "Rubik-Regular",
}

export const FontNameKey = Object.keys(FontName)

export const FontList = {
	titleFont: {
		fontSize: 14,
		fontFamily: "SFProDisplay-Regular",
	},
	subtitleFont: {
		fontSize: 11,
		fontFamily: "Nunito-Regular",
	},
	subtitleFontGrey: {
		fontSize: 14,
		fontFamily: "Nunito-Regular",
		color: ColorsList.greyFont,
	},
	subtitleFontGreyBold: {
		fontSize: 14,
		fontFamily: "Nunito-Bold",
		color: ColorsList.greyFont,
	},
	categoryFontBold: {
		fontSize: 14,
		fontFamily: "Nunito-Bold",
	},
	primaryFont: "Nunito-Regular",
	regularFont: "SFProDisplay-Regular",
	semiBoldFont: "SFProDisplay-Regular",
	boldFont: "Nunito-Bold",
	titleSize: 14,
	subtitleSize: 11,
}
