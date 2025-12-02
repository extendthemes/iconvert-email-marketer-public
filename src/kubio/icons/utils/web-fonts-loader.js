import WebFont from 'webfontloader';
import { castArray, isObject, map, uniq } from 'lodash';
const loadedFonts = new Map();

const addGoogleFontToLoadedList = (ownerDocument, font) => {
	let loadedGoogleFonts = loadedFonts.get(ownerDocument) || {};

	castArray(font).forEach((item) => {
		loadedGoogleFonts = {
			...loadedGoogleFonts,
			[item.family]: uniq([
				...item.variants.map((variant) => variant.toString()),
				...(loadedGoogleFonts[item.family] || []),
			]),
		};
	});

	loadedFonts.set(ownerDocument, loadedGoogleFonts);
};

const loadGoogleFonts = (fonts, ownerDocument) => {
	// eslint-disable-next-line no-undef
	ownerDocument = ownerDocument || top.document;

	if (!fonts.length) {
		return;
	}
	addGoogleFontToLoadedList(ownerDocument, fonts);
	const totalFonts = loadedFonts.get(ownerDocument) || {};

	WebFont.load({
		google: {
			families: map(
				totalFonts,
				(weights, family) => `${family}:${weights.join(',')}`
			),
		},
		context: ownerDocument?.defaultView,
		classes: false,
	});
};

const loadTypeKitFonts = (kit, document) => {
	if (isObject(kit)) {
		return;
	}
	document = document || window.document;
	(function (d) {
		const config = {
				kitId: kit,
				scriptTimeout: 3000,
				async: true,
			},
			h = d.documentElement,
			t = setTimeout(function () {
				h.className =
					h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive';
			}, config.scriptTimeout),
			tk = d.createElement('script');
		let a,
			f = false;
		h.className += ' wf-loading';
		tk.src = 'https://use.typekit.net/' + config.kitId + '.js';
		tk.async = true;
		tk.onload = tk.onreadystatechange = function () {
			a = this.readyState;
			if (f || (a && a !== 'complete' && a !== 'loaded')) return;
			f = true;
			clearTimeout(t);
			try {
				document.defaultView.Typekit.load(config);
			} catch (e) {}
		};
		document.head.appendChild(tk);
	})(document);
};

export { loadGoogleFonts, loadTypeKitFonts };
