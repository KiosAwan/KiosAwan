import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image as NativeImage, ActivityIndicator } from 'react-native';
import Container, { Body, BodyFlatList } from 'src/components/View/Container';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import { getFavorites, deleteFavorite } from 'src/utils/authhelper';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import Alert from 'src/utils/alert';
import { DEV_IMG_URL } from 'src/config';
import { FavoriteLoader } from 'src/components/LoadingPlaceholder';
import { SizeList } from 'src/styles/size';
import Divider from 'src/components/Row/Divider';
import { stateObject } from 'src/utils/state';
import { $BorderRadius } from 'src/utils/stylehelper';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import BottomSheetSelect from 'src/components/Picker/BottomSheetSelect';

const Favorite = ({ navigation }) => {
	const [state, setState] = stateObject({
		favorites: [],
		totalPage: 1,
		nextPage: 1,
		isLoading: true,
		selected: '~',
		group: ['~'],
		isLoadingMore: true
	})
	const { group, favorites, totalPage, nextPage, isLoading, isLoadingMore } = state
	useEffect(() => {
		getData(1)
	}, [])
	const removeFavorite = async (id_favorite, force) => {
		if (force) {
			await deleteFavorite(id_favorite)
			getData(1)
		} else {
			Alert("Peringatan", "Anda akan menghapus ini dari daftar Favorit?", [
				["Ya", () => removeFavorite(id_favorite, true)],
				["Tidak", null],
			])
		}
	}
	const getData = async (page) => {
		const { data } = await getFavorites(page)
		let favorites = []
		if (page == 1) {
			favorites = data.favorites
		} else {
			favorites = [...state.favorites, ...data.favorites]
		}
		let nextPage = page + 1
		let isLoading = false
		let isLoadingMore = false
		let totalPage = data.total_pages
		let group = ['~', ...data.allproduct]
		setState({ group, favorites, nextPage, isLoading, totalPage, isLoadingMore })
	}

	const _addMoreData = async () => {
		if (parseInt(nextPage) <= parseInt(totalPage)) {
			setState({ isLoadingMore: true })
			getData(nextPage)
		}
	}
	const _renderItem = ({ item: data, index: i }) => {
		const { type, customer_name, customerID, id_favorite, image, name } = data
		// const radiusTop = $BorderRadius(SizeList.borderRadius, SizeList.borderRadius, 0, 0)
		// const radiusBottom = $BorderRadius(0, 0, SizeList.borderRadius, SizeList.borderRadius)
		return <View>
			<View style={{
				backgroundColor: ColorsList.white,
				paddingHorizontal: SizeList.padding,
			}}>
				<View style={{ marginVertical: SizeList.base }} >
					<Button onPress={() => navigation.navigate(`/ppob/${type}`, item)} color="link" padding={SizeList.secondary} spaceBetween>
						<NativeImage style={[styles.image]} source={{ uri: `${DEV_IMG_URL}/${image}` }} />
						<View _flex>
							<Text>{name}</Text>
							<Text color="greyFontHard">{customerID}</Text>
							<Text>{customer_name ? customer_name.ucwords() : type.split('_').join(' ').ucwords()}</Text>
						</View>
						<Button padding={0} color="link" onPress={() => removeFavorite(id_favorite)}>
							<Image size={25} source={require("src/assets/icons/delete.png")} />
						</Button>
					</Button>
				</View>
				{i != dataFiltered().length - 1 && <Divider />}
			</View>
		</View>
	}
	const renderGroupValue = v => {
		if (v == 'pdam')
			return 'PDAM'
		return v == '~' ? 'Semua Produk' : v.split('_').join(' ').ucwords()
	}
	const dataFiltered = () => favorites.filter(({ type }) => state.selected == '~' || state.selected == type)
	return <Container>
		<GlobalHeader title="Daftar Favorit" onPressBack={() => navigation.goBack()} />
		<BottomSheetSelect
			btnStyle={{ paddingHorizontal: SizeList.bodyPadding }}
			noLabel
			closeOnSelect
			data={group}
			handleChangePicker={selected => setState({ selected })}
			value={renderGroupValue(state.selected)}
			renderItem={(item, i) => <Text font="SemiBold" style={i == 0 && { marginTop: SizeList.base }}>{renderGroupValue(item).toUpperCase()}</Text>}
		/>
		{isLoading ? <View style={{ marginTop: SizeList.base, paddingHorizontal: SizeList.bodyPadding }}>
			<FavoriteLoader />
			<FavoriteLoader />
			<FavoriteLoader />
			<FavoriteLoader />
			<FavoriteLoader />
			<FavoriteLoader />
			<FavoriteLoader />
			<FavoriteLoader />
		</View> :
			<BodyFlatList
				data={dataFiltered()}
				onEndReached={_addMoreData}
				onEndReachedThreshold={0.1}
				showsVerticalScrollIndicator={false}
				keyExtractor={(a, i) => i.toString()}
				renderItem={_renderItem}
			/>
		}
	</Container>
}

export default Favorite

const styles = StyleSheet.create({
	categoryWrap: {
		backgroundColor: ColorsList.greyAuthHard,
		padding: 5,
		paddingHorizontal: 10
	},
	wrapper: {
		backgroundColor: ColorsList.whiteColor,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		margin: 5,
		flex: 1
	},
	image: {
		width: 50,
		height: 50,
		marginRight: SizeList.base,
		resizeMode: "contain"
	},
	touchableTrash: {
		width: "15%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: ColorsList.greyBg
	},
	card1: {
		flexDirection: "row",
		alignItems: "center",
		width: "85%",
		padding: 5
	}
})