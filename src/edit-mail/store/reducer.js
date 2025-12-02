/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { combineReducers } from '@wordpress/data';

/**
 * Reducer storing the list of all programmatically removed panels.
 *
 * @param {Array}  state  Current state.
 * @param {Object} action Action object.
 *
 * @return {Array} Updated state.
 */
export function removedPanels(state = [], action) {
	switch (action.type) {
		case 'REMOVE_PANEL':
			if (!includes(state, action.panelName)) {
				return [...state, action.panelName];
			}
	}

	return state;
}

/**
 * Reducer for storing the name of the open modal, or null if no modal is open.
 *
 * @param {Object} state  Previous state.
 * @param {Object} action Action object containing the `name` of the modal
 *
 * @return {Object} Updated state
 */
export function activeModal(state = null, action) {
	switch (action.type) {
		case 'OPEN_MODAL':
			return action.name;
		case 'CLOSE_MODAL':
			return null;
	}

	return state;
}

/**
 * Reducer returning the editing canvas device type.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 *
 * @return {Object} Updated state.
 */
export function deviceType(state = 'Desktop', action) {
	switch (action.type) {
		case 'SET_PREVIEW_DEVICE_TYPE':
			return action.deviceType;
	}

	return state;
}

/**
 * Reducer to set the block inserter panel open or closed.
 *
 * Note: this reducer interacts with the list view panel reducer
 * to make sure that only one of the two panels is open at the same time.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 */
export function blockInserterPanel(state = false, action) {
	switch (action.type) {
		case 'SET_IS_LIST_VIEW_OPENED':
			return action.isOpen ? false : state;
		case 'SET_IS_INSERTER_OPENED':
			return action.value;
	}
	return state;
}

/**
 * Reducer to set the list view panel open or closed.
 *
 * Note: this reducer interacts with the inserter panel reducer
 * to make sure that only one of the two panels is open at the same time.
 *
 * @param {Object} state  Current state.
 * @param {Object} action Dispatched action.
 */
export function listViewPanel(state = false, action) {
	switch (action.type) {
		case 'SET_IS_INSERTER_OPENED':
			return action.value ? false : state;
		case 'SET_IS_LIST_VIEW_OPENED':
			return action.isOpen;
	}
	return state;
}

export default combineReducers({
	activeModal,
	removedPanels,
	deviceType,
	blockInserterPanel,
	listViewPanel,
});
