/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { __ } from '@wordpress/i18n';
import { store as editorStore } from '@wordpress/editor';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../store';

function KeyboardShortcuts() {
	const { getBlockSelectionStart } = useSelect( blockEditorStore );
	const {
		getEditorMode,
		isEditorSidebarOpened,
		isListViewOpened,
	} = useSelect( editPostStore );
	const isModeToggleDisabled = useSelect( ( select ) => {
		const { richEditingEnabled, codeEditingEnabled } = select(
			editorStore
		).getEditorSettings();
		return ! richEditingEnabled || ! codeEditingEnabled;
	}, [] );

	const {
		switchEditorMode,
		openGeneralSidebar,
		closeGeneralSidebar,
		toggleFeature,
		setIsListViewOpened,
	} = useDispatch( editPostStore );
	const { registerShortcut } = useDispatch( keyboardShortcutsStore );

	useEffect( () => {
		registerShortcut( {
			name: 'ic/edit-mail/toggle-mode',
			category: 'global',
			description: __( 'Switch between visual editor and code editor.' ),
			keyCombination: {
				modifier: 'secondary',
				character: 'm',
			},
		} );

		registerShortcut( {
			name: 'ic/edit-mail/toggle-fullscreen',
			category: 'global',
			description: __( 'Toggle fullscreen mode.' ),
			keyCombination: {
				modifier: 'secondary',
				character: 'f',
			},
		} );

		registerShortcut( {
			name: 'ic/edit-mail/toggle-list-view',
			category: 'global',
			description: __( 'Open the block list view.' ),
			keyCombination: {
				modifier: 'access',
				character: 'o',
			},
		} );

		registerShortcut( {
			name: 'ic/edit-mail/toggle-sidebar',
			category: 'global',
			description: __( 'Show or hide the settings sidebar.' ),
			keyCombination: {
				modifier: 'primaryShift',
				character: ',',
			},
		} );

		registerShortcut( {
			name: 'ic/edit-mail/next-region',
			category: 'global',
			description: __( 'Navigate to the next part of the editor.' ),
			keyCombination: {
				modifier: 'ctrl',
				character: '`',
			},
			aliases: [
				{
					modifier: 'access',
					character: 'n',
				},
			],
		} );

		registerShortcut( {
			name: 'ic/edit-mail/previous-region',
			category: 'global',
			description: __( 'Navigate to the previous part of the editor.' ),
			keyCombination: {
				modifier: 'ctrlShift',
				character: '`',
			},
			aliases: [
				{
					modifier: 'access',
					character: 'p',
				},
			],
		} );

		registerShortcut( {
			name: 'ic/edit-mail/keyboard-shortcuts',
			category: 'main',
			description: __( 'Display these keyboard shortcuts.' ),
			keyCombination: {
				modifier: 'access',
				character: 'h',
			},
		} );
	}, [] );

	useShortcut(
		'ic/edit-mail/toggle-mode',
		() => {
			switchEditorMode(
				getEditorMode() === 'visual' ? 'text' : 'visual'
			);
		},
		{
			isDisabled: isModeToggleDisabled,
		}
	);

	useShortcut( 'ic/edit-mail/toggle-fullscreen', () => {
		toggleFeature( 'fullscreenMode' );
	} );

	useShortcut( 'ic/edit-mail/toggle-sidebar', ( event ) => {
		// This shortcut has no known clashes, but use preventDefault to prevent any
		// obscure shortcuts from triggering.
		event.preventDefault();

		if ( isEditorSidebarOpened() ) {
			closeGeneralSidebar();
		} else {
			const sidebarToOpen = getBlockSelectionStart()
				? 'edit-post/block'
				: 'edit-post/document';
			openGeneralSidebar( sidebarToOpen );
		}
	} );

	useShortcut( 'ic/edit-mail/toggle-list-view', () =>
		setIsListViewOpened( ! isListViewOpened() )
	);

	return null;
}

export default KeyboardShortcuts;
