import React from 'react';
import RangeDatePicker from './DateRangePicker';
import { FontName } from 'src/styles/typography';

const DateRangePicker = ({ theme, ...props }) => {
	return <RangeDatePicker
		theme={{
			markColor: '#00adf5',
			markTextColor: '#ffffff',
			backgroundColor: '#ffffff',
			calendarBackground: '#ffffff',
			textSectionTitleColor: '#b6c1cd',
			textSectionTitleDisabledColor: '#d9e1e8',
			selectedDayBackgroundColor: '#00adf5',
			selectedDayTextColor: '#ffffff',
			todayTextColor: '#00adf5',
			dayTextColor: '#2d4150',
			textDisabledColor: '#d9e1e8',
			dotColor: '#00adf5',
			selectedDotColor: '#ffffff',
			arrowColor: 'orange',
			disabledArrowColor: '#d9e1e8',
			monthTextColor: 'blue',
			indicatorColor: 'blue',
			textDayFontFamily: FontName.Regular,
			textMonthFontFamily: FontName.Regular,
			textDayHeaderFontFamily: FontName.Regular,
			textDayFontWeight: '300',
			textMonthFontWeight: 'bold',
			textDayHeaderFontWeight: '300',
			textDayFontSize: 16,
			textMonthFontSize: 16,
			textDayHeaderFontSize: 16,
			...theme
		}}
		{...props}
	/>
}

export default DateRangePicker