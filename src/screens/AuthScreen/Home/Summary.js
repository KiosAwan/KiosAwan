import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Wrapper } from "src/components/View/Wrapper"
import { TouchableOpacity, View } from "react-native"
import { Text } from 'src/components/Text/CustomText';
import { SizeList } from 'src/styles/size';
import { convertRupiah } from 'src/utils/authhelper';
import { ColorsList } from 'src/styles/colors';

const Summary = ({ User, navigation }) => {
	const _getFlagColor = (flag) => {
		switch (flag) {
			case 0:
				return null
			case 1:
				return ColorsList.danger
			case 2:
				return ColorsList.success
			default:
				return null
		}
	}
	return User.store &&
		<TouchableOpacity onPress={() => navigation.navigate("Laporan")}>
			<Wrapper shadow style={{ marginTop: SizeList.base, backgroundColor: ColorsList.white }} justify="space-evenly">
				<View style={{ marginHorizontal: 10, paddingVertical: 10 }}>
					<Text align="center">Transaksi hari ini:</Text>
					<Wrapper>
						<Text color={_getFlagColor(User.store.penjualan_flag)} align="center">{convertRupiah(User.store.penjualan_harian)}</Text>
						{User.store.penjualan_flag != 0 &&
							<Icon
								size={15}
								name={User.store.penjualan_flag == 2 ? "sort-up" : "sort-down"}
								color={_getFlagColor(User.store.penjualan_flag)}
							/>
						}
					</Wrapper>
				</View>
				<View style={{ marginHorizontal: 10, paddingVertical: 10 }}>
					<Text align="center">Keuntungan hari ini:</Text>
					<Wrapper>
						<Text color={_getFlagColor(User.store.profit_flag)} align="center">{convertRupiah(User.store.profit_harian)}</Text>
						{User.store.profit_flag != 0 &&
							<Icon
								size={15}
								name={User.store.profit_flag == 2 ? "sort-up" : "sort-down"}
								color={_getFlagColor(User.store.profit_flag)}
							/>
						}
					</Wrapper>
				</View>
			</Wrapper>
		</TouchableOpacity>
}

export default Summary