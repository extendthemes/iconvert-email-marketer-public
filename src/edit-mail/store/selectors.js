/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import { createRegistrySelector } from '@wordpress/data';
import deprecated from '@wordpress/deprecated';
import { store as editorStore } from '@wordpress/editor';
import { store as interfaceStore } from '@wordpress/interface';
import { store as preferencesStore } from '@wordpress/preferences';

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

/**
 * Returns the current editing mode.
 *
 * @param {Object} state Global application state.
 *
 * @return {string} Editing mode.
 */
export const getEditorMode = createRegistrySelector(
	(select) => () =>
		select(preferencesStore).get('ic/edit-mail', 'editorMode') ?? 'visual'
);

/**
 * Returns true if the editor sidebar is opened.
 *
 * @param {Object} state Global application state
 *
 * @return {boolean} Whether the editor sidebar is opened.
 */
export const isEditorSidebarOpened = createRegistrySelector((select) => () => {
	const activeGeneralSidebar =
		select(interfaceStore).getActiveComplementaryArea('ic/edit-mail');
	return includes(
		['edit-post/document', 'edit-post/block'],
		activeGeneralSidebar
	);
});

/**
 * Returns true if the plugin sidebar is opened.
 *
 * @param {Object} state Global application state.
 *
 * @return {boolean} Whether the plugin sidebar is opened.
 */
export const isPluginSidebarOpened = createRegistrySelector((select) => () => {
	const activeGeneralSidebar =
		select(interfaceStore).getActiveComplementaryArea('ic/edit-mail');
	return (
		!!activeGeneralSidebar &&
		!includes(
			['edit-post/document', 'edit-post/block'],
			activeGeneralSidebar
		)
	);
});

/**
 * Returns the current active general sidebar name, or null if there is no
 * general sidebar active. The active general sidebar is a unique name to
 * identify either an editor or plugin sidebar.
 *
 * Examples:
 *
 *  - `edit-post/document`
 *  - `my-plugin/insert-image-sidebar`
 *
 * @param {Object} state Global application state.
 *
 * @return {?string} Active general sidebar name.
 */
export const getActiveGeneralSidebarName = createRegistrySelector(
	(select) => () => {
		return select(interfaceStore).getActiveComplementaryArea(
			'ic/edit-mail'
		);
	}
);

/**
 * Converts panels from the new preferences store format to the old format
 * that the post editor previously used.
 *
 * The resultant converted data should look like this:
 * {
 *     panelName: {
 *         enabled: false,
 *         opened: true,
 *     },
 *     anotherPanelName: {
 *         opened: true
 *     },
 * }
 *
 * @param {string[] | undefined} inactivePanels An array of inactive panel names.
 * @param {string[] | undefined} openPanels     An array of open panel names.
 *
 * @return {Object} The converted panel data.
 */
function convertPanelsToOldFormat(inactivePanels, openPanels) {
	// First reduce the inactive panels.
	const panelsWithEnabledState = inactivePanels?.reduce(
		(accumulatedPanels, panelName) => ({
			...accumulatedPanels,
			[panelName]: {
				enabled: false,
			},
		}),
		{}
	);

	// Then reduce the open panels, passing in the result of the previous
	// reduction as the initial value so that both open and inactive
	// panel state is combined.
	const panels = openPanels?.reduce((accumulatedPanels, panelName) => {
		const currentPanelState = accumulatedPanels?.[panelName];
		return {
			...accumulatedPanels,
			[panelName]: {
				...currentPanelState,
				opened: true,
			},
		};
	}, panelsWithEnabledState ?? {});

	// The panels variable will only be set if openPanels wasn't `undefined`.
	// If it isn't set just return `panelsWithEnabledState`, and if that isn't
	// set return an empty object.
	return panels ?? panelsWithEnabledState ?? EMPTY_OBJECT;
}

/**
 * Returns the preferences (these preferences are persisted locally).
 *
 * @param {Object} state Global application state.
 *
 * @return {Object} Preferences Object.
 */
export const getPreferences = createRegistrySelector((select) => () => {
	deprecated(`wp.data.select( 'ic/edit-mail' ).getPreferences`, {
		since: '6.0',
		alternative: `wp.data.select( 'core/preferences' ).get`,
	});

	// These preferences now exist in the preferences store.
	// Fetch them so that they can be merged into the post
	// editor preferences.
	const preferences = [
		'hiddenBlockTypes',
		'editorMode',
		'preferredStyleVariations',
	].reduce((accumulatedPrefs, preferenceKey) => {
		const value = select(preferencesStore).get(
			'ic/edit-mail',
			preferenceKey
		);

		return {
			...accumulatedPrefs,
			[preferenceKey]: value,
		};
	}, {});

	// Panels were a preference, but the data structure changed when the state
	// was migrated to the preferences store. They need to be converted from
	// the new preferences store format to old format to ensure no breaking
	// changes for plugins.
	const inactivePanels = select(preferencesStore).get(
		'ic/edit-mail',
		'inactivePanels'
	);
	const openPanels = select(preferencesStore).get(
		'ic/edit-mail',
		'openPanels'
	);
	const panels = convertPanelsToOldFormat(inactivePanels, openPanels);

	return {
		...preferences,
		panels,
	};
});

/**
 *
 * @param {Object} state         Global application state.
 * @param {string} preferenceKey Preference Key.
 * @param {*}      defaultValue  Default Value.
 *
 * @return {*} Preference Value.
 */
export function getPreference(state, preferenceKey, defaultValue) {
	deprecated(`wp.data.select( 'ic/edit-mail' ).getPreference`, {
		since: '6.0',
		alternative: `wp.data.select( 'core/preferences' ).get`,
	});

	// Avoid using the `getPreferences` registry selector where possible.
	const preferences = getPreferences(state);
	const value = preferences[preferenceKey];
	return value === undefined ? defaultValue : value;
}

/**
 * Returns an array of blocks that are hidden.
 *
 * @return {Array} A list of the hidden block types
 */
export const getHiddenBlockTypes = createRegistrySelector((select) => () => {
	return (
		select(preferencesStore).get('ic/edit-mail', 'hiddenBlockTypes') ??
		EMPTY_ARRAY
	);
});

/**
 * Returns true if the given panel was programmatically removed, or false otherwise.
 * All panels are not removed by default.
 *
 * @param {Object} state     Global application state.
 * @param {string} panelName A string that identifies the panel.
 *
 * @return {boolean} Whether or not the panel is removed.
 */
export function isEditorPanelRemoved(state, panelName) {
	return includes(state.removedPanels, panelName);
}

/**
 * Returns true if the given panel is enabled, or false otherwise. Panels are
 * enabled by default.
 *
 * @param {Object} state     Global application state.
 * @param {string} panelName A string that identifies the panel.
 *
 * @return {boolean} Whether or not the panel is enabled.
 */
export const isEditorPanelEnabled = createRegistrySelector(
	(select) => (state, panelName) => {
		const inactivePanels = select(preferencesStore).get(
			'ic/edit-mail',
			'inactivePanels'
		);
		return (
			!isEditorPanelRemoved(state, panelName) &&
			!inactivePanels?.includes(panelName)
		);
	}
);

/**
 * Returns true if the given panel is open, or false otherwise. Panels are
 * closed by default.
 *
 * @param {Object} state     Global application state.
 * @param {string} panelName A string that identifies the panel.
 *
 * @return {boolean} Whether or not the panel is open.
 */
export const isEditorPanelOpened = createRegistrySelector(
	(select) => (state, panelName) => {
		const openPanels = select(preferencesStore).get(
			'ic/edit-mail',
			'openPanels'
		);
		return !!openPanels?.includes(panelName);
	}
);

/**
 * Returns true if a modal is active, or false otherwise.
 *
 * @param {Object} state     Global application state.
 * @param {string} modalName A string that uniquely identifies the modal.
 *
 * @return {boolean} Whether the modal is active.
 */
export function isModalActive(state, modalName) {
	return state.activeModal === modalName;
}

/**
 * Returns whether the given feature is enabled or not.
 *
 * @param {Object} state   Global application state.
 * @param {string} feature Feature slug.
 *
 * @return {boolean} Is active.
 */
export const isFeatureActive = createRegistrySelector(
	(select) => (state, feature) => {
		return !!select(preferencesStore).get('ic/edit-mail', feature);
	}
);

/**
 * Returns true if the plugin item is pinned to the header.
 * When the value is not set it defaults to true.
 *
 * @param {Object} state      Global application state.
 * @param {string} pluginName Plugin item name.
 *
 * @return {boolean} Whether the plugin item is pinned.
 */
export const isPluginItemPinned = createRegistrySelector(
	(select) => (state, pluginName) => {
		return select(interfaceStore).isItemPinned(
			'ic/edit-mail',
			pluginName
		);
	}
);

/**
 * Returns the current editing canvas device type.
 *
 * @param {Object} state Global application state.
 *
 * @return {string} Device type.
 */
export function __experimentalGetPreviewDeviceType(state) {
	return state.deviceType;
}

/**
 * Returns true if the inserter is opened.
 *
 * @param {Object} state Global application state.
 *
 * @return {boolean} Whether the inserter is opened.
 */
export function isInserterOpened(state) {
	return !!state.blockInserterPanel;
}

/**
 * Get the insertion point for the inserter.
 *
 * @param {Object} state Global application state.
 *
 * @return {Object} The root client ID, index to insert at and starting filter value.
 */
export function __experimentalGetInsertionPoint(state) {
	const { rootClientId, insertionIndex, filterValue } =
		state.blockInserterPanel;
	return { rootClientId, insertionIndex, filterValue };
}

/**
 * Returns true if the list view is opened.
 *
 * @param {Object} state Global application state.
 *
 * @return {boolean} Whether the list view is opened.
 */
export function isListViewOpened(state) {
	return state.listViewPanel;
}
