const isAmazon = (url = false) => {
	try {
		const URL = new URL(url ? url : window.location.href);
		return URL.host.includes('amazon') && !url.host.includes('advertising');
	} catch (error) {
		console.log(error);
		console.log(window.location.href);
		return false;
	}
};

const isAmazonAdvertising = (url = false) => {
	try {
		const URL = new URL(url ? url : window.location.href);
		return URL.host.includes('amazon') && url.host.includes('advertising');
	} catch (error) {
		return false;
	}
};

export {isAmazon, isAmazonAdvertising};
