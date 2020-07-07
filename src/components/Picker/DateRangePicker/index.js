import React from 'react';
import RangeDatePicker from './DateRangePicker';
import { FontName } from 'src/styles/typography';
import { ColorsList } from 'src/styles/colors';

const DateRangePicker = ({ theme, ...props }) => {
	return <RangeDatePicker
		theme={{
			markColor: ColorsList.primary,
			markTextColor: ColorsList.white,
			backgroundColor: ColorsList.white,
			calendarBackground: ColorsList.white,
			textSectionTitleColor: ColorsList.greyFont,
			textSectionTitleDisabledColor: ColorsList.greyAuthHard,
			selectedDayBackgroundColor: ColorsList.primary,
			selectedDayTextColor: ColorsList.white,
			todayTextColor: ColorsList.primary,
			dayTextColor: ColorsList.greyFont,
			textDisabledColor: ColorsList.greyAuthHard,
			dotColor: ColorsList.primary,
			selectedDotColor: ColorsList.white,
			arrowColor: ColorsList.greyFont,
			disabledArrowColor: ColorsList.greyAuthHard,
			monthTextColor: ColorsList.primary,
			indicatorColor: ColorsList.greyAuthHard,
			textDayFontFamily: FontName.Regular,
			textMonthFontFamily: FontName.Regular,
			textDayHeaderFontFamily: FontName.Regular,
			// textDayFontWeight: '300',
			// textMonthFontWeight: 'normal',
			// textDayHeaderFontWeight: '300',
			textDayFontSize: 14,
			textMonthFontSize: 14,
			textDayHeaderFontSize: 14,
			...theme
		}}
		{...props}
	/>
}

export default DateRangePicker