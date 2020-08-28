const timer = 60 * 6 // in minutes
export const inActiveTimer = timer * 60 * 1000

const onInactive = async isActive => {
	console.log(isActive)
}

export default onInactive
