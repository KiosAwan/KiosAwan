import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { View, RefreshControl } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HOST_URL } from 'src/config'
import { getProfile } from 'src/redux/actions/actionsUserData'
import { getUserToken } from 'src/utils/authhelper'
import { Button } from 'src/components/Button/Button'
import { AwanPopup } from 'src/components/ModalContent/Popups'
import Container, { Body } from 'src/components/View/Container';
import { SizeList } from 'src/styles/size';
import styles from './style'
import Ads from './Ads';
import Feature from './Feature';
import Header from './Header';
import Summary from './Summary';
import Notification from './Notification';

const Home = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const dispatch = useDispatch()

	const [maintenance, setMaintanance] = useState(false)
	const [message, setMessage] = useState(false)
	const [onRefresh, setOnRefresh] = useState(false)
	const [news, setNews] = useState()
	const [newsLoading, setNewsLoading] = useState(true)
	const [_alert, _setAlert] = useState(false)
	const [_alertTitle, _setAlertTitle] = useState('')
	const [_alertMessage, _setAlertMessage] = useState('')

	const _getNewsData = async () => {
		const res = await Axios.get('https://kiosawan.com/wp-json/wp/v2/posts')
		setNews(res.data)
		setNewsLoading(false)
	}

	const _checkService = async () => {
		const userToken = await getUserToken()
		const res = await Axios.get(`${HOST_URL}/check_service`, {
			headers: { "authorization": userToken }
		})
		res.data.data.status == 2 && _featureDisabled();
		if (res.data.data.service == 1) {
			setMaintanance(true)
			setMessage(res.data.data.message)
		} else {
			setMaintanance(false)
		}
	}

	const _featureDisabled = (action, num) => {
		let title, message
		if (User.data.status == 2) {
			title = 'AKUN ANDA TERBLOKIR'
			message = `Anda tidak dapat menggunakan layanan apapun, silahkan hubungi customer service dengan kode ${User.data.banned_log.code}`
		} else {
			switch (action) {
				case 'ppob':
					title = 'FITUR PAYMENT POINT'
					message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
					break;
				case 'stock':
					title = 'FITUR BELANJA STOK'
					message = 'Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan'
					break;
				case 'hutang':
					title = 'FITUR PENCATATAN HUTANG'
					message = 'Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan'
					break;
				case 'blokir':
					title = 'AKUN ANDA TERBLOKIR'
					message = `Anda tidak dapat menggunakan layanan apapun, silahkan hubungi customer service dengan kode ${num}`
					break;
				case 'topup':
					title = 'FITUR TOPUP'
					message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
					break;
				case 'riwayat':
					title = 'FITUR RIWAYAT'
					message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
					break;
				default:
					title = 'FITUR KASIR'
					message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
					break;
			}
		}
		_setAlertTitle(title)
		_setAlertMessage(message)
		_setAlert(true)
	}

	const _handleRefresh = async () => {
		const userToken = await getUserToken()
		dispatch(getProfile(User.data.id, userToken))
		_checkService()
		setOnRefresh(false)
	}

	const _completeProfile = () => {
		if (!User.store) {
			_setAlert(false)
			navigation.navigate('/temp/create-pin')
		}
		else if (User.data.status == 0) {
			_setAlert(false)
			navigation.navigate('/drawer/settings/change-email')
		} else {
			_setAlert(false)
		}
	}

	useEffect(() => {
		_checkService()
		_getNewsData()
	}, [])

	return <Container>
		<AwanPopup.Title title={_alertTitle} message={_alertMessage} visible={_alert}>
			<View></View>
			<Button width='30%' onPress={_completeProfile}>OK</Button>
		</AwanPopup.Title>
		<Body refreshControl={<RefreshControl refreshing={onRefresh} onRefresh={_handleRefresh} />}>
			<Header
				User={User}
				navigation={navigation}
				_featureDisabled={_featureDisabled}
				_handleRefresh={_handleRefresh}
			/>
			<Summary User={User} navigation={navigation} />
			<View style={styles.childContainer}>
				<View style={{ paddingVertical: SizeList.base }}>
					<Notification
						User={User}
						maintenance={maintenance}
						message={message}
					/>
					<Feature
						User={User}
						_featureDisabled={_featureDisabled}
						navigation={navigation}
					/>
				</View>
			</View>
			<Ads loading={newsLoading} newsData={news} />
		</Body>
	</Container>
}

export default Home