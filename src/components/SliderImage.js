import React from "react"
import {
	StyleSheet,
	Text,
	Image,
	View,
	SafeAreaView,
	Dimensions,
} from "react-native"

import Carousel, { Pagination } from "react-native-snap-carousel"

const height = Dimensions.get("window").height
const width = Dimensions.get("window").width
export default class SliderImage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			activeSlide: 0,
			carouselItems: [
				{
					title: "Item 1",
					image: require("../assets/images/card_1.png"),
				},
				{
					title: "Item 2",
					image: require("../assets/images/card_2.png"),
				},
			],
		}
	}

	_renderItem({ item, index }) {
		return (
			<Image
				style={{ height: height / 5, width: "100%", borderRadius: 5 }}
				source={item.image}
			/>
		)
	}

	get pagination() {
		const { carouselItems, activeSlide } = this.state
		return (
			<Pagination
				dotsLength={carouselItems.length}
				activeDotIndex={activeSlide}
				containerStyle={{ position: "absolute", bottom: 0 }}
				dotColor="#cd0192"
				dotStyle={{
					width: 12,
					height: 12,
					borderRadius: 6,
				}}
				dotContainerStyle={{ justifyContent: "center" }}
				inactiveDotColor="black"
				inactiveDotOpacity={0.4}
				inactiveDotScale={0.6}
			/>
		)
	}
	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Carousel
					data={this.state.carouselItems}
					sliderWidth={(width * 95) / 100}
					itemWidth={(width * 95) / 100}
					renderItem={this._renderItem}
					onSnapToItem={index => this.setState({ activeSlide: index })}
				/>
				{this.pagination}
			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		height: height / 5,
		width: (width * 95) / 100,
		alignItems: "center",
	},
})
