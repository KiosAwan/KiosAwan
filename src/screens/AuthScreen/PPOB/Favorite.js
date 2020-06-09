import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image as NativeImage, ActivityIndicator } from 'react-native';
import Container, { Body } from 'src/components/View/Container';
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

const Favorite = ({ navigation }) => {
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [favorites, setFavorites] = useState([])
	const [nextPage, setNextPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
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
		let result = []
		if (page == 1) {
			result = data.favorites
		} else {
			result = [...favorites, ...data.favorites]
		}
		result = result.reduce((obj, curr, i) => {
			const key = curr.type
			if (!obj[key]) {
				obj[key] = []
			}
			obj[key] = [...obj[key], curr]
			return obj
		}, {})
		let countPage = page + 1
		setIsLoading(false)
		setIsLoadingMore(false)
		setNextPage(countPage)
		setTotalPage(data.total_pages)
		setFavorites(result)
	}

	const _addMoreData = async () => {
		if (parseInt(nextPage) <= parseInt(totalPage)) {
			setIsLoadingMore(true)
			getData(nextPage)
		}
	}
	const _renderItem = ({ item: type }) => {
		const data = favorites[type]
		return <View>
			<Text style={{ marginBottom: SizeList.base }}>{type.toUpperCase()}</Text>
			<View style={{ marginBottom: SizeList.base, backgroundColor: ColorsList.white, padding: SizeList.padding, borderRadius: SizeList.borderRadius }}>
				{
					data.rMap((item, i) => {
						const {
							customerID,
							id_favorite,
							image,
							name
						} = item
						return <View>
							<Button onPress={() => navigation.navigate(`/ppob/${type}`, item)} color="link" padding={SizeList.secondary} spaceBetween>
								<NativeImage style={[styles.image]} source={{ uri: `${DEV_IMG_URL}/${image}` }} />
								<View _flex>
									<Text color="primary">{name}</Text>
									<Text>{customerID}</Text>
								</View>
								<Button padding={0} color="link" onPress={() => removeFavorite(id_favorite)}>
									<Image size={25} source={require("src/assets/icons/trash-primary.png")} />
								</Button>
							</Button>
							{i != data.length - 1 && <Divider />}
						</View>
					})
				}
			</View>
		</View>
	}
	return <Container>
		<GlobalHeader title="Daftar Favorit" onPressBack={() => navigation.goBack()} />
		<Body style={{ paddingTop: 0 }}>
			{isLoading ? <View>
				<FavoriteLoader />
				<FavoriteLoader />
				<FavoriteLoader />
				<FavoriteLoader />
				<FavoriteLoader />
				<FavoriteLoader />
				<FavoriteLoader />
				<FavoriteLoader />
			</View> :
				Object.keys(favorites).length > 0 ?
					<FlatList
						style={{ flex: 1 }}
						onEndReached={_addMoreData}
						onEndReachedThreshold={0.1}
						showsVerticalScrollIndicator={false}
						data={Object.keys(favorites)}
						renderItem={_renderItem}
						keyExtractor={(a, i) => i.toString()}
					/> :
					<Button disabled color="info">Anda Belum Mempunyai Daftar Favorit</Button>
			}
			{isLoadingMore && <ActivityIndicator style={{ margin: 10 }} color={ColorsList.primary} />}
		</Body>
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
		width: 30,
		height: 30,
		marginRight: 10,
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