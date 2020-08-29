import "./src/utils/default"
import UserInactivity from "react-native-user-inactivity"
import store from "./src/redux/store"
import SplashScreen from "react-native-splash-screen"
import React, { useEffect } from "react"
import onInactive, { inActiveTimer } from "src/utils/onInactive"
import OneSignal from "react-native-onesignal"
import BackgroundTimer from "react-native-user-inactivity/lib/BackgroundTimer"
import AppNavigator from "./src/routes/AppNavigator"
import * as Sentry from "@sentry/react-native"
import { Root } from "native-base"
import { Provider } from "react-redux"
import { Linking } from 'react-native';
import { Deeplink } from "./src/routes/Deeplink"
import Storage from "src/utils/keyStores"
import { isEmulator, getBundleId } from "react-native-device-info"
import { firebase } from "@react-native-firebase/analytics"
import env from "src/utils/env"

const { googleService, prefix, sentryDsn, oneSignalId } = env

const App = () => {
	const _handleOpenURL = event => {
		Deeplink(event.url)
	}
	const fireBaseInit = async () => {
		const appId = getBundleId()
		const { client, project_info } = googleService
		const [targetClient] = client.filter(c => appId === c.client_info.android_client_info.package_name)
		if (targetClient) {
			const firebaseConfig = {
				apiKey: targetClient.api_key[0].current_key,
				appId: targetClient.client_info.mobilesdk_app_id,
				databaseURL: project_info.firebase_url,
				messagingSenderId: project_info.project_number,
				projectId: project_info.project_id,
				storageBucket: project_info.storage_bucket
			}
			firebase.initializeApp(firebaseConfig)
		} else {
			console.warn('Failed to initialize firebase, package id is not found')
		}
	}
	const onIds = async device => {
		const isEmu = await isEmulator()
		if (isEmu)
			if (__DEV__) await Storage.setItem("@push_token", "pushtokenemulator")
		if (device) await Storage.setItem("@push_token", device.userId)
	}
	useEffect(() => {
		if (firebase.apps === 0) fireBaseInit()
		Sentry.init({ dsn: sentryDsn })
		OneSignal.init(oneSignalId)
		OneSignal.inFocusDisplaying(2)
		OneSignal.addEventListener("ids", onIds)
		Linking.getInitialURL()
			.then(Deeplink)
			.catch(err => console.error("An error occurred", err))
		Linking.addEventListener("url", _handleOpenURL)
		SplashScreen.hide()
		onIds()
		return () => {
			OneSignal.removeEventListener("ids", onIds)
			Linking.removeEventListener("url", _handleOpenURL)
		}
	}, [])
	return (
		<Root>
			<Provider store={store}>
				<UserInactivity
					timeForInactivity={inActiveTimer}
					timeoutHandler={BackgroundTimer}
					onAction={onInactive}>
					<AppNavigator uriPrefix={prefix} />
				</UserInactivity>
			</Provider>
		</Root>
	)
}

export default App
