import React from 'react';
import { Text } from 'src/components/Text/CustomText';
import { SizeList } from 'src/styles/size';
import { NewsCardPlaceholder } from 'src/components/LoadingPlaceholder';
import { Image } from 'src/components/CustomImage';
import { Dimensions, View, ScrollView, FlatList } from 'react-native';
import { CardTextImage } from 'src/components/Card/CardComp';

const Ads = ({ loading, newsData, navigation }) => {
	const { width, height } = Dimensions.get('window')
	return <View>
		<ScrollView
			horizontal={true}
			showsHorizontalScrollIndicator={false}>
			<Image style={{ width: width - 40, borderRadius: 5, height: 170, marginLeft: SizeList.bodyPadding }} source={require('src/assets/images/Banner.jpg')} />
			<Image style={{ width: width - 40, borderRadius: 5, height: 170, marginHorizontal: SizeList.bodyPadding }} source={require('src/assets/images/Banner2.jpg')} />
		</ScrollView>
		<Text style={{ margin: SizeList.bodyPadding, marginTop: 0 }} font="SemiBold">Tahukah Kamu?</Text>
		{
			loading ?
				<NewsCardPlaceholder />
				:
				<FlatList
					data={newsData}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					renderItem={({ item, index }) => (
						<CardTextImage
							style={{ marginLeft: SizeList.bodyPadding, marginRight: index == newsData.length - 1 ? SizeList.bodyPadding : 0 }}
							onPressCard={() => navigation.navigate('/news-screen', { title: item.title.rendered, data: item.content.rendered, newsImage: item.jetpack_featured_media_url, link: item.link })}
							image={item.jetpack_featured_media_url}
							info={item.title.rendered}
						/>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
		}
	</View>
}

export default Ads