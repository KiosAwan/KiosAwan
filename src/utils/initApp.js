import { isEmulator, getBundleId } from "react-native-device-info"
import OneSignal from "react-native-onesignal"
import env from "src/utils/env"
import Storage from "src/utils/keyStores"
import * as Sentry from "@sentry/react-native"
import { Linking } from "react-native"
import { firebase } from "@react-native-firebase/analytics"
import Deeplink from "src/routes/Deeplink"

const { googleService, sentryDsn } = env

const onIds = async device => {
	const isEmu = await isEmulator()
	if (isEmu) if (__DEV__) await Storage.setItem("@push_token", "pushtokenemulator")
	if (device) await Storage.setItem("@push_token", device.userId)
}
const fireBaseInit = async () => {
	const appId = getBundleId()
	const { client, project_info } = googleService
	const [targetClient] = client.filter(
		({ client_info }) => client_info ? appId === client_info.android_client_info.package_name : false,
	)
	if (targetClient) {
		const firebaseConfig = {
			apiKey: targetClient.api_key[0].current_key,
			appId: targetClient.client_info.mobilesdk_app_id,
			databaseURL: project_info.firebase_url,
			messagingSenderId: project_info.project_number,
			projectId: project_info.project_id,
			storageBucket: project_info.storage_bucket,
		}
		firebase.initializeApp(firebaseConfig)
	} else {
		console.warn("Failed to initialize firebase, package id is not found")
	}
}
const initApp = () => {
	OneSignal.init(env.oneSignalId)
	OneSignal.inFocusDisplaying(2)
	OneSignal.addEventListener("ids", onIds)
	if (firebase.apps === 0) fireBaseInit()
	Sentry.init({ dsn: sentryDsn })
	Linking.getInitialURL()
		.then(Deeplink)
		.catch(err => console.error("An error occurred", err))
	Linking.addEventListener("url", Deeplink)
}

export default initApp