import React from 'react';
import { Picker as PickerNB } from 'native-base';
import { ColorsList } from 'src/styles/colors';

const Picker = props => {
	const { data, renderItem } = props
	return <PickerNB mode="dropdown" {...props} style={{
		color: ColorsList.secondary
	}}>
		{
			typeof renderItem == 'function' && data.rMap(v => renderItem(v))
		}
	</PickerNB>
}

const Item = props => <PickerNB.Item {...props} />

export { Item }
export default Picker