/**
 * External dependencies
 */
import { castArray, without } from 'lodash';

/**
 * WordPress dependencies
 */
import { speak } from '@wordpress/a11y';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { store as interfaceStore } from '@wordpress/interface';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '.';

/**
 * Returns an action object used in signalling that the user opened an editor sidebar.
 *
 * @param {?string} name Sidebar name to be opened.
 */
export const openGeneralSidebar =
	( name ) =>
	( { registry } ) =>
		registry
			.dispatch( interfaceStore )
			.enableComplementaryArea( editPostStore.name, name );

/**
 * Returns an action object signalling that the user closed the sidebar.
 */
export const closeGeneralSidebar =
	() =>
	( { registry } ) =>
		registry
			.dispatch( interfaceStore )
			.disableComplementaryArea( editPostStore.name );

/**
 * Returns an action object used in signalling that the user opened a modal.
 *
 * @param {string} name A string that uniquely identifies the modal.
 *
 * @return {Object} Action object.
 */
export function openModal( name ) {
	return {
		type: 'OPEN_MODAL',
		name,
	};
}

/**
 * Returns an action object signalling that the user closed a modal.
 *
 * @return {Object} Action object.
 */
export function closeModal() {
	return {
		type: 'CLOSE_MODAL',
	};
}

/**
 * Returns an action object used to enable or disable a panel in the editor.
 *
 * @param {string} panelName A string that identifies the panel to enable or disable.
 *
 * @return {Object} Action object.
 */
export const toggleEditorPanelEnabled =
	( panelName ) =>
	( { registry } ) => {
		const inactivePanels =
			registry
				.select( preferencesStore )
				.get( 'ic/edit-mail', 'inactivePanels' ) ?? [];

		const isPanelInactive = !! inactivePanels?.includes( panelName );

		// If the panel is inactive, remove it to enable it, else add it to
		// make it inactive.
		let updatedInactivePanels;
		if ( isPanelInactive ) {
			updatedInactivePanels = inactivePanels.filter(
				( invactivePanelName ) => invactivePanelName !== panelName
			);
		} else {
			updatedInactivePanels = [ ...inactivePanels, panelName ];
		}

		registry
			.dispatch( preferencesStore )
			.set( 'ic/edit-mail', 'inactivePanels', updatedInactivePanels );
	};

/**
 * Opens a closed panel and closes an open panel.
 *
 * @param {string} panelName A string that identifies the panel to open or close.
 */
export const toggleEditorPanelOpened =
	( panelName ) =>
	( { registry } ) => {
		const openPanels =
			registry
				.select( preferencesStore )
				.get( 'ic/edit-mail', 'openPanels' ) ?? [];

		const isPanelOpen = !! openPanels?.includes( panelName );

		// If the panel is open, remove it to close it, else add it to
		// make it open.
		let updatedOpenPanels;
		if ( isPanelOpen ) {
			updatedOpenPanels = openPanels.filter(
				( openPanelName ) => openPanelName !== panelName
			);
		} else {
			updatedOpenPanels = [ ...openPanels, panelName ];
		}

		registry
			.dispatch( preferencesStore )
			.set( 'ic/edit-mail', 'openPanels', updatedOpenPanels );
	};

/**
 * Returns an action object used to remove a panel from the editor.
 *
 * @param {string} panelName A string that identifies the panel to remove.
 *
 * @return {Object} Action object.
 */
export function removeEditorPanel( panelName ) {
	return {
		type: 'REMOVE_PANEL',
		panelName,
	};
}

/**
 * Triggers an action used to toggle a feature flag.
 *
 * @param {string} feature Feature name.
 */
export const toggleFeature =
	( feature ) =>
	( { registry } ) =>
		registry.dispatch( preferencesStore ).toggle( 'ic/edit-mail', feature );

/**
 * Triggers an action used to switch editor mode.
 *
 * @param {string} mode The editor mode.
 */
export const switchEditorMode =
	( mode ) =>
	( { registry } ) => {
		registry
			.dispatch( preferencesStore )
			.set( 'ic/edit-mail', 'editorMode', mode );

		// Unselect blocks when we switch to the code editor.
		if ( mode !== 'visual' ) {
			registry.dispatch( blockEditorStore ).clearSelectedBlock();
		}

		const message =
			mode === 'visual'
				? __( 'Visual editor selected', 'iconvert-email-marketer' )
				: __( 'Code editor selected', 'iconvert-email-marketer' );
		speak( message, 'assertive' );
	};

/**
 * Triggers an action object used to toggle a plugin name flag.
 *
 * @param {string} pluginName Plugin name.
 */
export const togglePinnedPluginItem =
	( pluginName ) =>
	( { registry } ) => {
		const isPinned = registry
			.select( interfaceStore )
			.isItemPinned( 'ic/edit-mail', pluginName );

		registry
			.dispatch( interfaceStore )
			[ isPinned ? 'unpinItem' : 'pinItem' ](
				'ic/edit-mail',
				pluginName
			);
	};

/**
 * Returns an action object used in signaling that a style should be auto-applied when a block is created.
 *
 * @param {string}  blockName  Name of the block.
 * @param {?string} blockStyle Name of the style that should be auto applied. If undefined, the "auto apply" setting of the block is removed.
 */
export const updatePreferredStyleVariations =
	( blockName, blockStyle ) =>
	( { registry } ) => {
		if ( ! blockName ) {
			return;
		}

		const existingVariations =
			registry
				.select( preferencesStore )
				.get( 'ic/edit-mail', 'preferredStyleVariations' ) ?? {};

		// When the blockStyle is omitted, remove the block's preferred variation.
		if ( ! blockStyle ) {
			const updatedVariations = {
				...existingVariations,
			};

			delete updatedVariations[ blockName ];

			registry
				.dispatch( preferencesStore )
				.set(
					'ic/edit-mail',
					'preferredStyleVariations',
					updatedVariations
				);
		} else {
			// Else add the variation.
			registry
				.dispatch( preferencesStore )
				.set( 'ic/edit-mail', 'preferredStyleVariations', {
					...existingVariations,
					[ blockName ]: blockStyle,
				} );
		}
	};

/**
 * Update the provided block types to be visible.
 *
 * @param {string[]} blockNames Names of block types to show.
 */
export const showBlockTypes =
	( blockNames ) =>
	( { registry } ) => {
		const existingBlockNames =
			registry
				.select( preferencesStore )
				.get( 'ic/edit-mail', 'hiddenBlockTypes' ) ?? [];

		const newBlockNames = without(
			existingBlockNames,
			...castArray( blockNames )
		);

		registry
			.dispatch( preferencesStore )
			.set( 'ic/edit-mail', 'hiddenBlockTypes', newBlockNames );
	};

/**
 * Update the provided block types to be hidden.
 *
 * @param {string[]} blockNames Names of block types to hide.
 */
export const hideBlockTypes =
	( blockNames ) =>
	( { registry } ) => {
		const existingBlockNames =
			registry
				.select( preferencesStore )
				.get( 'ic/edit-mail', 'hiddenBlockTypes' ) ?? [];

		const mergedBlockNames = new Set( [
			...existingBlockNames,
			...castArray( blockNames ),
		] );

		registry
			.dispatch( preferencesStore )
			.set( 'ic/edit-mail', 'hiddenBlockTypes', [ ...mergedBlockNames ] );
	};

/**
 * Returns an action object used to toggle the width of the editing canvas.
 *
 * @param {string} deviceType
 *
 * @return {Object} Action object.
 */
export function __experimentalSetPreviewDeviceType( deviceType ) {
	return {
		type: 'SET_PREVIEW_DEVICE_TYPE',
		deviceType,
	};
}

/**
 * Returns an action object used to open/close the inserter.
 *
 * @param {boolean|Object} value                Whether the inserter should be
 *                                              opened (true) or closed (false).
 *                                              To specify an insertion point,
 *                                              use an object.
 * @param {string}         value.rootClientId   The root client ID to insert at.
 * @param {number}         value.insertionIndex The index to insert at.
 *
 * @return {Object} Action object.
 */
export function setIsInserterOpened( value ) {
	return {
		type: 'SET_IS_INSERTER_OPENED',
		value,
	};
}

/**
 * Returns an action object used to open/close the list view.
 *
 * @param {boolean} isOpen A boolean representing whether the list view should be opened or closed.
 * @return {Object} Action object.
 */
export function setIsListViewOpened( isOpen ) {
	return {
		type: 'SET_IS_LIST_VIEW_OPENED',
		isOpen,
	};
}
