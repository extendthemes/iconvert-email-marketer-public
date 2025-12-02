import _ from 'lodash';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

function convertObjectsToArrays(input) {
	if (_.isEmpty(input)) {
		return input;
	}
	if (Array.isArray(input)) {
		return input.map(convertObjectsToArrays);
	} else if (input && typeof input === 'object') {
		const keys = Object.keys(input);
		const isArrayLike = keys.every((key, i) => {
			if (_.isNumber(key)) {
				return true;
			}
			const parsedKey = parseInt(key);
			if (!isNaN(parsedKey)) {
				return true;
			}

			return false;
		});

		if (isArrayLike) {
			return keys.map((key) => convertObjectsToArrays(input[key]));
		}
		const result = {};
		for (const key in input) {
			result[key] = convertObjectsToArrays(input[key]);
		}
		return result;
	}

	return input;
}
const getBackendData = (path, fallback = null) => {
	return _.get(window.iconvertemUtils, path, fallback);
};

let previousContactFormsResult = null;
const getContactFormsOptions = async () => {
	if (previousContactFormsResult) {
		return previousContactFormsResult;
	}
	try {
		const res = await apiFetch({
			path: addQueryArgs('iconvertem/v1/contact-form-7/forms'),
			method: 'GET',
		});
		const forms = res?.data;
		if (Array.isArray(forms)) {
			previousContactFormsResult = forms;
			return forms;
		}
	} catch (e) {
		console.error(e);
	}

	return [];
};

let previousPromoterFormsResult = null;
const getPromoterFormsOptions = async () => {
	if (previousPromoterFormsResult) {
		return previousPromoterFormsResult;
	}
	try {
		const res = await apiFetch({
			path: addQueryArgs('iconvertem/v1/promoter/forms'),
			method: 'GET',
		});
		const forms = res?.data;
		if (Array.isArray(forms)) {
			previousPromoterFormsResult = forms;
			return forms;
		}
	} catch (e) {
		console.error(e);
	}

	return [];
};
export {
	convertObjectsToArrays,
	getBackendData,
	getContactFormsOptions,
	getPromoterFormsOptions,
};
