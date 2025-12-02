const getPreviewElementByModelId = function (
	clientId,
	document = window.document
) {
	try {
		return document.querySelector(`[data-block="${clientId}"]`);
	} catch (e) {
		console.error(e);
		return null;
	}
};

const getBrowser = () => {
	const navigator = window.navigator;
	const nAgt = navigator.userAgent;
	let browserName = navigator.appName;
	let fullVersion = '' + parseFloat(navigator.appVersion);
	let nameOffset, verOffset;

	// In Opera 15+, the true version is after "OPR/"

	if ((verOffset = nAgt.indexOf('OPR/')) != -1) {
		browserName = 'Opera';
		fullVersion = nAgt.substring(verOffset + 4);
	}
	// In older Opera, the true version is after "Opera" or after "Version"
	else if ((verOffset = nAgt.indexOf('Opera')) != -1) {
		browserName = 'Opera';
		fullVersion = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf('Version')) != -1)
			fullVersion = nAgt.substring(verOffset + 8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
		browserName = 'Microsoft Internet Explorer';
		fullVersion = nAgt.substring(verOffset + 5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
		browserName = 'Google Chrome';
		fullVersion = nAgt.substring(verOffset + 7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
		browserName = 'Safari';
		fullVersion = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf('Version')) != -1)
			fullVersion = nAgt.substring(verOffset + 8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
		browserName = 'Mozilla Firefox';
		fullVersion = nAgt.substring(verOffset + 8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if (
		(nameOffset = nAgt.lastIndexOf(' ') + 1) <
		(verOffset = nAgt.lastIndexOf('/'))
	) {
		browserName = nAgt.substring(nameOffset, verOffset);
		fullVersion = nAgt.substring(verOffset + 1);
		if (browserName.toLowerCase() === browserName.toUpperCase()) {
			browserName = navigator.appName;
		}
	}

	return {
		name: browserName.toLowerCase(),
		version: fullVersion.split(' ').shift(),
	};
};

export { getPreviewElementByModelId, getBrowser };
