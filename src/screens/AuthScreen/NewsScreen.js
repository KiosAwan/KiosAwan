import React, {useEffect, useState} from 'react';
import { View, ActivityIndicator} from 'react-native';
import { GlobalHeader } from '../../components/Header/Header';
import WebView from 'react-native-webview'

const NewsScreen = ({navigation}) =>  {

    const [url , setUrl] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => { 
        _getUrl()
    }, [])


    const _getUrl = async () => {
        const {weburl} = await navigation.state.params
        setUrl(weburl)
    }

    const _onPressBack = () => {
        navigation.goBack()
    }
    return (
        <View style={{flex : 1}}>
            <GlobalHeader onPressBack={_onPressBack} />
                 <View style={{flex : 1}}>
                    {isLoading && 
                    <View style={{flex : 1, alignItems : "center", justifyContent : "center"}}>
                        <ActivityIndicator size={40}/>
                    </View>
                    }
                    <WebView
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                    javaScriptEnabled
                    source={{uri: url}}
                    />
                </View>
        </View>  
    );
  }

  export default NewsScreen