export const Deeplink = url => {
	if (!url) {
		return false
	}
	const urlObj = {
		url: url.getRawUrl(),
		params: url.getParamFromUrl(),
	}
	console.log(urlObj)
}
