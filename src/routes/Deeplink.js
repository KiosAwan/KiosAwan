Deeplink = event => {
	if (event) {
		const { url } = event
		if (!url) {
			return false
		}
		const urlObj = {
			url: url.getRawUrl(),
			params: url.getParamFromUrl(),
		}
		console.log(urlObj)
	}
}
export default Deeplink