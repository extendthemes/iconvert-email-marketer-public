import { createReduxStore, register } from '@wordpress/data';

const DEFAULT_STATE = {
	maxWidth: 600,
};

const actions = {
	setMaxWidth(maxWidth) {
		return {
			type: 'SET_MAX_WIDTH',
			maxWidth,
		};
	},
	fetchFromAPI(path) {
		return {
			type: 'FETCH_FROM_API',
			path,
		};
	},
};

const reducer = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case 'SET_MAX_WIDTH':
			return {
				...state,
				maxWidth: action.maxWidth,
			};

		default:
			return state;
	}
};

const selectors = {
	getMaxWidth: (state) => state,
};

const store = createReduxStore('iconvertem_block', {
	reducer,
	actions,
	selectors,
});

register(store);
