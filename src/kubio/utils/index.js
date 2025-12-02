// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
} from '@wordpress/blocks';
import { useCallback } from '@wordpress/element';
import cleanDeep from 'clean-deep';
import deepdash from 'deepdash-es';
import lodash, {
	debounce,
	flatten,
	isArray,
	isObject,
	mergeWith,
	omit,
	set,
	uniq,
} from 'lodash';
import isEqual from 'react-fast-compare';
import getSlug from 'speakingurl';
import tinycolor from 'tinycolor2';
import { useTransformLinkControlValue } from './menu-item-content';
import { refreshBlockStyleRefs } from './refresh-style-refs';

let _ = lodash || window.lodash;

const fromHtmlEntities = function (string) {
	return (string + '').replace(/&#\d+;/gm, function (s) {
		return String.fromCharCode(s.match(/\d+/gm)[0]);
	});
};

const checkIfPathValueIsArrayElement = function (value, path) {
	// [NUMBER]
	const match1 = /(.*)(\[(\d+)]$)/g.exec(path);
	//.NUMBER
	const match2 = /(.*)(\.(\d+)$)/g.exec(path);
	let pathValueIsArrayElement = false;

	let elementParentPath = null;
	let index = null;
	let elementParent = null;
	if (match1) {
		elementParentPath = match1[1];
		index = match1[3];
		elementParent = _.get(value, elementParentPath);
		if (Array.isArray(elementParent)) {
			pathValueIsArrayElement = true;
		}
	}
	if (match2) {
		elementParentPath = match2[1];
		index = match2[3];
		elementParent = _.get(value, elementParentPath);
		if (Array.isArray(elementParent)) {
			pathValueIsArrayElement = true;
		}
	}
	return {
		pathValueIsArrayElement,
		index,
		elementParent,
	};
};

const unsetArraySafe = (value, path) => {
	const {
		pathValueIsArrayElement,
		index,
		elementParent,
	} = checkIfPathValueIsArrayElement(value, path);

	if (pathValueIsArrayElement) {
		elementParent.splice(index, 1);
	} else {
		_.unset(value, path);
	}
};

const mergeNoArrays = (...args) => {
	return mergeWith.apply(null, [
		...args,
		function (dest, src) {
			if (isArray(src)) {
				return src;
			}

			if (isArray(dest)) {
				return dest;
			}
		},
	]);
};

const pascalCase = _.flow(_.camelCase, _.upperFirst);

_.pascalCase = pascalCase;

_.unsetArraySafe = unsetArraySafe;

_.cleanDeep = (obj, options = {}) => {
	return cleanDeep(
		obj,
		_.merge(
			{
				emptyArrays: true,
				emptyObjects: false,
				emptyStrings: false,
				nullValues: false,
				undefinedValues: false,
			},
			options
		)
	);
};

const differenceObj = (object, base) => {
	function changes(_object, _base) {
		return _.transform(_object, function (result, value, key) {
			if (!isEqual(value, _base[key])) {
				result[key] =
					_.isObject(value) && _.isObject(_base[key])
						? changes(value, _base[key])
						: value;
			}
		});
	}

	return changes(object, base);
};

const isValueUnitObject = (toTest) => {
	const keys = Object.keys(toTest);

	return (
		keys.length === 2 && _.difference(keys, ['unit', 'value']).length === 0
	);
};

const _diffUnitValueObjTree = (object, base) => {
	const diff = {};

	Object.keys(object).forEach((key) => {
		const objValue = object[key];
		const baseValue = base?.[key];

		if (!baseValue) {
			diff[key] = objValue;
		} else if (isObject(objValue)) {
			if (!isEqual(objValue, baseValue)) {
				if (isValueUnitObject(objValue)) {
					diff[key] = objValue;
				} else {
					diff[key] = _diffUnitValueObjTree(objValue, baseValue);
				}
			}
		} else if (!isEqual(objValue, baseValue)) {
			diff[key] = objValue;
		}
	});

	return diff;
};

const diffUnitValueObjTree = (object, base) => {
	return _diffUnitValueObjTree(object, base);
};

_.differenceObj = differenceObj;

_.freeze = (value) => {
	// eslint-disable-next-line no-undef
	if (!top.skip) {
		Object.freeze(value);
	}
	return value;
};

_ = deepdash(_);

//https://stackoverflow.com/questions/4187146/truncate-number-to-two-decimal-places-without-rounding
const toFixedNoRounding = (num, fixed = 2) => {
	const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
	return parseFloat(num.toString().match(re)[0]);
};
const toFixed = (num, fixed = 5) => {
	const number = Number.parseFloat(num);
	return Number.parseFloat(number.toFixed(fixed));
};

const toFixedHighPrecision = (num, fixed = 6) => {
	return toFixed(num, fixed);
};

const deviceToMedia = (device) => {
	return device.toLowerCase();
};

const getBackendData = (path) => {
	return _.get(window.kubioUtilsData, path);
};

const defaultAssetURL = (rel) => {
	return getBackendData('defaultAssetsUrl') + '/' + _.trim(rel, '/');
};

const useDelayedFunction = (func, delay) => {
	return useCallback(_.debounce(func, delay), [func]);
};

const ucwords = function (str) {
	if (!str) {
		return '';
	}

	str = str.toLowerCase();
	return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (
		$1
	) {
		return $1.toUpperCase();
	});
};
const setSidesData = (relPath, value) => {
	const sides = ['top', 'bottom', 'left', 'right'];
	const changes = {};
	sides.forEach((side) => {
		set(changes, [side, relPath], value);
	});

	return changes;
};

const unsetSidesData = (data, relPath) => {
	const sides = ['top', 'bottom', 'left', 'right'];
	const changes = {};
	sides.forEach((side) => {
		_.unset(data, `${side}.${relPath}`);
	});

	return changes;
};

const slugify = (text) => {
	const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
	const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
	const p = new RegExp(a.split('').join('|'), 'g');

	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(p, (c) => b.charAt(a.indexOf(c))) // Replace special chars
		.replace(/&/g, '-and-') // Replace & with 'and'
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};

const getUniqueSlug = (slug, ownerDocument = document, options = {}) => {
	const defaultOptions = {
		//by default use the data-slug attribute;
		getSlugNode: (slug, ownerDocument) => {
			return ownerDocument.querySelector(`[data-slug='${slug}']`);
		},
	};
	slug = slug.trim();
	const mergedOptions = _.merge({}, defaultOptions, options);
	const { getSlugNode } = mergedOptions;
	// slugify input
	slug = slugify(slug);

	let found = false;
	let index = 1;
	let newSlug = slug;
	while (!found) {
		if (index === 1) {
			if (getSlugNode(slug, ownerDocument) === null) {
				found = true;
			} else {
				index++;
			}
		} else if (getSlugNode(slug + '-' + index, ownerDocument) === null) {
			newSlug += '-' + index;
			found = true;
		} else {
			index++;
		}
	}
	return newSlug;
};

const generateSlug = (text, ownerDocument = document, options = {}) => {
	let newSlug = getSlug(text);
	newSlug = getUniqueSlug(newSlug, ownerDocument, options);
	return newSlug;
};

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const transformBlockToTemplate = (
	{ name, innerBlocks = [], attributes = {} } = {},
	{ skipAttributes = false, skipRef = false } = {}
) => {
	if (!name) {
		return false;
	}
	if (!skipAttributes && skipRef) {
		attributes = {
			...(attributes || {}),
			kubio: omit(attributes?.kubio || {}, ['styleRef', 'hash', 'id']),
		};
	}

	return [
		name,
		skipAttributes ? {} : attributes,
		innerBlocks.map((innerBlock) =>
			transformBlockToTemplate(innerBlock, { skipAttributes, skipRef })
		),
	];
};

const transformTemplateToBlock = ([name, attributes, innerBlocks]) => {
	return createBlock(
		name,
		attributes,
		createBlocksFromInnerBlocksTemplate(innerBlocks)
	);
};

const getBlocksUsedInTemplate = ([name, , innerBlocks], isRoot = true) => {
	let response = [name];

	innerBlocks.forEach(([innerBlockName, , innerBlocksChildren]) => {
		response.push(innerBlockName);
		response = response.concat(
			flatten(
				innerBlocksChildren.map((child) =>
					getBlocksUsedInTemplate(child, false)
				)
			)
		);
	});

	if (isRoot) {
		response = uniq(response);
	}

	return response;
};

const delayPromise = (duration) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), duration);
	});
};

const span = document.createElement('span');

const stripTags = (text) => {
	span.innerHTML = text;

	return span.textContent;
};

const toFixedDecimals = (number, decimals = 2) => {
	number = parseFloat(number);

	return parseFloat(number.toFixed(decimals));
};

const monitorValueChange = (key, value) => {
	// eslint-disable-next-line no-undef
	top.kubioMonitoredValues = top.kubioMonitoredValues || {};

	// eslint-disable-next-line no-undef
	const { kubioMonitoredValues } = top;

	if (!kubioMonitoredValues[key]) {
		kubioMonitoredValues[key] = value;
	} else {
		const oldValue = kubioMonitoredValues[key];
		if (isEqual(value, oldValue)) {
			// eslint-disable-next-line no-console
			console.warn(
				'@Kubio - Value change monitor diffs:',
				differenceObj({ value }, { value: oldValue })
			);
		}
	}

	return value;
};

const measureFnPerformance = (func, funcName) => (...args) => {
	const key = `Performance - ${funcName}`;
	// eslint-disable-next-line no-console
	console.time(key);
	func(...args);
	// eslint-disable-next-line no-console
	console.timeEnd(key);
};

/**
 * Queue function calls executions
 *
 * @param          queueResolver  - queue resolver callback
 * @param {number} resolveTimeout - queue resolver execution debounce
 * @param {string} name           - optional queue string name
 * @return {(function(...[*]=): void)|*}
 */
const queueCall = (queueResolver, resolveTimeout, name = '') => {
	let queue = [];

	const resolver = debounce(() => {
		if (name) {
			console.group(`queueCall: resolve - ${name}`);
			console.log('queue:', queue);
			console.trace();
			console.groupEnd();
		}
		const localQueue = [...queue];
		queue = [];
		queueResolver(localQueue);
	}, resolveTimeout);

	return (...args) => {
		queue.push(args);
		if (name) {
			console.group(`queueCall: update - ${name}`);
			console.log('queue:', queue);
			console.trace();
			console.groupEnd();
		}
		resolver();
	};
};
const findBlockByName = (blockList, blockName) => {
	let foundBlock = blockList.find((item) => item?.name === blockName);

	if (foundBlock) {
		return foundBlock;
	}
	blockList.forEach((block) => {
		if (foundBlock) {
			return;
		}
		if (block?.name === blockName) {
			foundBlock = block;
		}

		const innerBlocks = _.get(block, 'innerBlocks');
		if (Array.isArray(innerBlocks)) {
			const foundInnerBLock = findBlockByName(innerBlocks, blockName);
			if (foundInnerBLock) {
				foundBlock = foundInnerBLock;
			}
		}
	});
	return foundBlock;
};

function convertColibriColorPalette(colibriColorPalette) {
	const paletteArray = Object.values(colibriColorPalette);
	const kubioColorPalette = paletteArray.map((color, index) => {
		const rgbColor = tinycolor(color).toRgb();
		const rgbArray = [rgbColor?.r, rgbColor?.g, rgbColor?.b];
		return {
			slug: `kubio-color-${index + 1}`,
			color: rgbArray,
		};
	});

	return kubioColorPalette;
}

const __experimentalDeepMemize = (callback) => {
	const calls = new Map();

	return (...args) => {
		for (const [key, value] of calls.entries()) {
			if (isEqual(key, args)) {
				return value;
			}
		}

		const result = callback(...args);
		calls.set(args, result);
		return result;
	};
};

export * from './compare-versions';
export * from './dom';
export * from './hooks';
export * from './is-gutentag-prefixed';
export * from './serializer';
export * from './web-fonts-loader';
export {
	fromHtmlEntities,
	mergeNoArrays,
	toFixedNoRounding,
	toFixed,
	toFixedHighPrecision,
	deviceToMedia,
	defaultAssetURL,
	useDelayedFunction,
	ucwords,
	unsetArraySafe,
	differenceObj,
	diffUnitValueObjTree,
	pascalCase,
	cleanDeep,
	_,
	setSidesData,
	unsetSidesData,
	getUniqueSlug,
	slugify,
	generateSlug,
	capitalizeFirstLetter,
	transformBlockToTemplate,
	delayPromise,
	transformTemplateToBlock,
	refreshBlockStyleRefs,
	stripTags,
	toFixedDecimals,
	useTransformLinkControlValue,
	monitorValueChange,
	measureFnPerformance,
	findBlockByName,
	convertColibriColorPalette,
	queueCall,
	__experimentalDeepMemize,
	getBlocksUsedInTemplate,
};
