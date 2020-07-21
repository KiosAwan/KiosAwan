import axios from 'axios'

export const getLocale = (localeId) => {
	return {
		type: "GET_LANGUAGE",
		payload: {
			localeId,
			locale: localeId == 'id' ? {
				QUICK_ACTIONS: "Menu Utama"
			} : {
					QUICK_ACTIONS: "Quick Actions"
				}
		}
	}
}