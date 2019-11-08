const isAmazon = (url = false) => {
	try {
		const URL = new URL(url ? url : window.location.href);
	} catch (error) {
		return false;
	}

	return URL.host.includes('amazon') && !url.host.includes('advertising');
};

const isAmazonAdvertising = (url = false) => {
	try {
		const URL = new URL(url ? url : window.location.href);
	} catch (error) {
		return false;
	}

	return URL.host.includes('amazon') && url.host.includes('advertising');
};

export {isAmazon, isAmazonAdvertising};
