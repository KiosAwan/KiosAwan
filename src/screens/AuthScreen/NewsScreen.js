import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, Image } from 'react-native';
import { GlobalHeader } from '../../components/Header/Header';
import HTML from 'react-native-render-html';
import { Text } from 'src/components/Text/CustomText';
import { FontList } from 'src/styles/typography';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';

const NewsScreen = ({ navigation }) => {

    const [title, setTitle] = useState('')
    const [imageData, setImage] = useState('')
    const [data, setData] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        _getData()
    }, [])


    const _getData = async () => {
        const { title, data , newsImage } = await navigation.state.params
        setTitle(title)
        setData(data)
        setImage(newsImage)
        setIsLoading(false)
    }

    const _onPressBack = () => {
        navigation.goBack()
    }
    return (
        <View style={{ flex: 1 }}>
            <GlobalHeader title="News" onPressBack={_onPressBack} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1,  margin : 10 }}>
                {isLoading &&
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <ActivityIndicator size={40} />
                    </View>
                }
                {/* <WebView
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    javaScriptEnabled
                    source={{ uri: url }}
                /> */}
                <Text style={{ alignSelf: 'center', textAlign : 'center' }}>{title}</Text>
                <Image source={{uri : imageData ? imageData : null}} style={{width : SizeList.width, height : 200,marginVertical : 10, resizeMode : 'contain'}}/>
                <HTML
                    tagsStyles={{
                        p: { fontFamily: FontList.primaryFont, color: ColorsList.greySoft },
                        li: { fontFamily: FontList.primaryFont, color: ColorsList.greySoft },
                    }}
                    html={data}
                />
            </ScrollView>
        </View>
    );
}

export default NewsScreen