import _ from 'lodash';

const urlPrefix = '';

const lightboxMediaValues = {
	AUTO: '',
	IFRAME: 'iframe',
	IMAGE: 'image',
	VIDEO: 'video',
};

const lightboxMediaOptions = [
	{ label: 'Auto', value: lightboxMediaValues.AUTO },
	{ label: 'Iframe', value: lightboxMediaValues.IFRAME },
	{ label: 'Image', value: lightboxMediaValues.IMAGE },
	{ label: 'Video', value: lightboxMediaValues.VIDEO },
];

const lightboxMedia = {
	values: lightboxMediaValues,
	options: lightboxMediaOptions,
};

const defaultValue = {
	value: '',
	typeOpenLink: 'sameWindow',
	lightboxGroup: undefined,
	noFollow: false,
	lightboxMedia: lightboxMediaValues.AUTO,
};

const getLinkAttributes = function (linkObject) {
	const mergedLinkObject = _.merge({}, defaultValue, linkObject);
	const linkAttributes = {
		href: null,
		target: null,
		rel: null,
		'data-kubio-component': null,
	};
	if (mergedLinkObject) {
		linkAttributes.href = mergedLinkObject.value;

		// //temporary fix to disable links inside editor
		// if (mergedLinkObject.value) {
		// 	linkAttributes.href = '';
		// }
		//don't add link attributes in editor besides the href
		if (mergedLinkObject.typeOpenLink === 'sameWindow') {
			linkAttributes.target = null;
		}
		if (mergedLinkObject.typeOpenLink === 'newWindow') {
			linkAttributes.target = '_blank';
		}

		//disable lightbox in editor
		// if (mergedLinkObject.typeOpenLink === 'lightbox') {
		// 	linkAttributes['data-default-type'] = getLightboxMediaValue(
		// 		mergedLinkObject.lightboxMedia
		// 	);
		//
		// 	//disable in editor
		// 	// eslint-disable-next-line no-restricted-syntax
		// 	// linkAttributes['data-fancybox'] = Math.random();
		// }
		if (mergedLinkObject.noFollow) {
			linkAttributes.rel = 'nofollow';
		}
	}

	// An empty link is not valid but it also triggers weird behaviour in color inheritance with the :visited.
	if (linkAttributes.href === '') {
		delete linkAttributes.href;
	}

	return linkAttributes;
};

const targetAttributeToOption = (attribute) => {
	switch (attribute) {
		case '_blank':
			return 'newWindow';
		case 'sameWindow':
			return null;
		default:
			return undefined;
	}
};
const hrefIsNotEmpty = function (href) {
	return href && href.trim() !== urlPrefix;
};
export { getLinkAttributes, hrefIsNotEmpty };
export default {
	defaultValue,
	urlPrefix,
	getLinkAttributes,
	targetAttributeToOption,
	lightboxMedia,
};
