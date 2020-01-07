// Install react-native-fs, react-native-permissions

import React, { Component } from 'react';
import Share from 'react-native-share';
// import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
// import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

let format = 'jpg'

const Screenshot = {
	take: async (ref, callback, exec) => {
		// let storagePermission = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
		// if (storagePermission == RESULTS.GRANTED) {
			let url, uri = await ref.capture()
		// 	if (ref.props.options && ref.props.options.newName) {
		// 		await Screenshot.rename(uri, ref.props.options.newName)
		// 		url = ref.props.options.newName
		// 	} else
		// 		url = uri
		// 	callback({ filename: 'lajskdggasd.jpg', url: `data:image/jpeg;base64,${uri}`, type: 'image/jpg' })
		// } else {
		// 	if (!exec) {
		// 		await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
		// 		Screenshot.take(ref, callback, true)
		// 	}
		// }
		callback({ url: uri })
	},
	rename: async (src, dest) => {
		// let paths = dest.split('/')
		// let folder = paths.map((str, i) => i < paths.length - 1 ? str : null).join('/')
		// let filename = paths[paths.length - 1]
		// filename = filename.replace(filename.extractNumber(), Date.now())
		// if (!await RNFS.exists(folder))
		// 	RNFS.mkdir(folder)
		// await RNFS.moveFile(src, folder + filename)
		// return await RNFS.readFile(folder + filename, 'base64')
	},
	share: opt => {
		Share.open(Config.shareOpt(opt))
	}
}
export const Config = {
	viewShotOpt: opt => {
		let name = DeviceInfo.getApplicationName()
		name = `/sdcard/${name}/struk/${name}-struk-${Date.now()}.${format}`
		return { newName: name, format: format, quality: 0.9, ...opt }
	},
	shareOpt: opt => ({
		message: '',
		subject: 'Subject',
		social: 'whatsapp',
		title: 'Bagikan lewat',
		...opt
	})
}

export default Screenshot