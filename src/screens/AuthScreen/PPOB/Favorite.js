import React, { Component } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image as NativeImage } from 'react-native';
import Container, { ContainerBody } from 'src/components/View/Container';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import { ColorsList } from 'src/styles/colors';
import { Wrapper } from 'src/components/View/Wrapper';
import { Image } from 'src/components/CustomImage';

const Favorite = ({ navigation }) => {
    return (
        <Container>
            <GlobalHeader title="Favorit" onPressBack={() => navigation.goBack()} />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={[
                    { title: "Pulsa", data: [1, 2, 3] },
                    { title: "Listrik", data: [1, 2, 3] },
                    { title: "BPJS", data: [1, 2, 3] }
                ]}
                renderItem={({ item }) => (
                    <View>
                        <View style={styles.categoryWrap}>
                            <Text>{item.title}</Text>
                        </View>
                        <View style={{ margin: 5, flex: 1 }}>
                            {item.data.map(isi => (
                                <View style={styles.wrapper}>
                                    <View style={styles.card1} >
                                        <NativeImage style={styles.image} source={require("src/assets/images/card_1.png")} />
                                        <View>
                                            <Text>Token listrik</Text>
                                            <Text>129388122381293</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.touchableTrash}>
                                        <Image size={25} source={require("src/assets/icons/trash-primary.png")} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            />
        </Container>
    )
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
        flex : 1
    },
    image: {
        width: 70,
        height: 40,
        resizeMode: "contain",
        marginHorizontal: 10
    },
    touchableTrash: {
        width: "15%",
        height : "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ColorsList.greyBg
    },
    card1 : { 
        flexDirection: "row", 
        alignItems: "center", 
        width: "85%", 
        padding : 5 
    }
})