import React, { useState } from 'react';
import { Image, View } from 'react-native';
import Container, { ContainerBody } from "src/components/View/Container"
import { Text } from 'src/components/Text/CustomText';
import DropdownSelect from 'src/components/Picker/Dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Wrapper } from 'src/components/View/Wrapper';
import { ColorsList } from 'src/styles/colors';

const AsuransiTipus = ({ navigation }) => {
	const [selected, setSelected] = useState()
	const [detailOn, setDetailOn] = useState(false)
	return <Container header={{
		title: 'Tipus',
		onPressBack: () => navigation.goBack()
	}}>
		<ContainerBody>
			<Wrapper justify="flex-start">
				<Image style={{ height: 30, width: 70, resizeMode: 'contain' }} source={require('src/assets/icons/ppob/topup/BNI.png')} />
				<Icon style={{ marginLeft: 20 }} color={ColorsList.greyFont} onPress={() => setDetailOn(!detailOn)} size={15} name={detailOn ? "chevron-up" : "chevron-down"} />
			</Wrapper>
			{detailOn && <View>
				<Text>Ullamco ea ad eiusmod amet id. Consequat velit id culpa sunt est voluptate do tempor excepteur. Cupidatat quis officia ad irure magna velit.
					Mollit tempor culpa exercitation ullamco ut velit eiusmod reprehenderit in enim fugiat proident duis occaecat. Et incididunt deserunt veniam in ipsum Lorem anim. Ex id et deserunt ex Lorem id cupidatat. Ex aliquip laboris do nulla et proident pariatur voluptate Lorem consectetur culpa id laborum eu. Anim fugiat non sint tempor incididunt elit consectetur et. Eiusmod ea culpa aliquip ex.
					Ad incididunt laborum aliqua velit. Sunt in id nisi cupidatat exercitation esse aute amet occaecat nostrud excepteur. Labore culpa cupidatat dolor ex id exercitation duis ullamco sunt nulla elit. Consequat veniam commodo dolore quis culpa consectetur voluptate cupidatat fugiat. Amet duis culpa laborum quis dolore amet incididunt aliquip aliqua. Amet in sit incididunt sit exercitation adipisicing dolore culpa excepteur proident et qui anim consectetur. Lorem proident tempor cupidatat dolore est enim veniam amet.
				</Text>
			</View>}
			<View style={{ backgroundColor: ColorsList.whiteColor, padding: 10, borderRadius: 5 }}>
				<DropdownSelect
					data={[1, 2, 3, 4, 5]}
					renderItem={({ item, index }) => {
						return <Text>{item}</Text>
					}}
					value={selected}
					onSelect={({ item }) => setSelected(item)}
					placeholder="Test placeholder..."
				/>
			</View>
		</ContainerBody>
	</Container>
}
export default AsuransiTipus
