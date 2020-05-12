import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Image as NativeImage, ActivityIndicator } from 'react-native';
import Container from 'src/components/View/Container';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import { getFavorites, deleteFavorite } from 'src/utils/authhelper';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import Alert from 'src/utils/alert';

const Favorite = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [favorites, setFavorites] = useState([])
    useEffect(() => {
        GetData()
    }, [])
    const removeFavorite = async (id_favorite, force) => {
        if (force) {
            await deleteFavorite(id_favorite)
            GetData()
        } else {
            Alert("Peringatan", "Anda akan menghapus ini dari daftar Favorit?", [
                ["Ya", () => removeFavorite(id_favorite, true)],
                ["Tidak", null],
            ])
        }
    }
    const GetData = async () => {
        const { data } = await getFavorites()
        setIsLoading(false)
        setFavorites(data)
    }
    const _renderItem = ({ item }) => {
        let { id_favorite, customerID, type } = item
        return <View>
            <Button color={["white"]} onPress={() => navigation.navigate(`/ppob/${type}`, item)} noRadius style={{ margin: 10 }} spaceBetween>
                <Wrapper _flex flexStart>
                    <NativeImage style={[styles.image]} source={require("src/assets/images/card_1.png")} />
                    <View>
                        <Text>{type.ucwords()}</Text>
                        <Text>{customerID}</Text>
                    </View>
                </Wrapper>
                <Button noRadius color={['greyBg']} onPress={() => removeFavorite(id_favorite)}>
                    <Image size={25} source={require("src/assets/icons/trash-primary.png")} />
                </Button>
            </Button>
        </View>
    }
    return <Container>
        <GlobalHeader title="Favorit" onPressBack={() => navigation.goBack()} />
        {isLoading ? <ActivityIndicator color={ColorsList.primary} /> :
            favorites.length > 0 ? <FlatList
                showsVerticalScrollIndicator={false}
                data={favorites}
                renderItem={_renderItem}
                keyExtractor={(item, i) => i.toString()}
            /> : <Button style={{ margin: 10 }} disabled color="info">Anda Belum Mempunyai Daftar Favorit</Button>
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
        width: 70,
        height: 40,
        resizeMode: "contain",
        marginHorizontal: 10
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