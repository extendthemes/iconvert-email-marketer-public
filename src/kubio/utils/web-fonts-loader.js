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

const loadGoogleFonts = () => {};
const loadTypeKitFonts = () => {};

export { loadGoogleFonts, loadTypeKitFonts };
