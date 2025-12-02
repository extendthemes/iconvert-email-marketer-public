/**
 * WordPress dependencies
 */
import { NavigableToolbar, ToolSelector } from '@wordpress/block-editor';
import { Button, ToolbarItem } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	EditorHistoryRedo,
	EditorHistoryUndo,
	TableOfContents,
} from '@wordpress/editor';
import { useCallback, useRef } from '@wordpress/element';
import { _x, __ } from '@wordpress/i18n';
import { listView, plus } from '@wordpress/icons';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../../store';

const preventDefault = ( event ) => {
	event.preventDefault();
};

function HeaderToolbar() {
	const inserterButton = useRef();
	const { setIsInserterOpened, setIsListViewOpened } =
		useDispatch( editPostStore );
	const { isInserterOpened, isListViewOpen, listViewShortcut } = useSelect(
		( select ) => {
			const { isListViewOpened } = select( editPostStore );
			const { getShortcutRepresentation } = select(
				keyboardShortcutsStore
			);

			return {
				isInserterOpened: select( editPostStore ).isInserterOpened(),
				isListViewOpen: isListViewOpened(),
				listViewShortcut: getShortcutRepresentation(
					'ic/edit-mail/toggle-list-view'
				),
			};
		},
		[]
	);
	const isLargeViewport = useViewportMatch( 'medium' );
	const isWideViewport = useViewportMatch( 'wide' );

	/* translators: accessibility text for the editor toolbar */
	const toolbarAriaLabel = __( 'Document tools', 'iconvert-email-marketer' );

	const toggleListView = useCallback(
		() => setIsListViewOpened( ! isListViewOpen ),
		[ setIsListViewOpened, isListViewOpen ]
	);
	const openInserter = useCallback( () => {
		if ( isInserterOpened ) {
			// Focusing the inserter button closes the inserter popover.
			inserterButton.current.focus();
		}

		setIsInserterOpened( ! isInserterOpened );
	}, [ isInserterOpened, setIsInserterOpened ] );
	return (
		<NavigableToolbar
			className="edit-post-header-toolbar"
			aria-label={ toolbarAriaLabel }
		>
			<div className="edit-post-header-toolbar__left">
				<ToolbarItem
					ref={ inserterButton }
					as={ Button }
					className="edit-post-header-toolbar__inserter-toggle"
					variant="primary"
					isPressed={ isInserterOpened }
					onMouseDown={ preventDefault }
					onClick={ openInserter }
					icon={ plus }
					/* translators: button label text should, if possible, be under 16 characters. */
					label={ _x(
						'Toggle block inserter',
						'Generic label for block inserter button',
						'iconvert-email-marketer'
					) }
					showTooltip={ true }
				></ToolbarItem>

				<ToolbarItem as={ EditorHistoryUndo } showTooltip={ true } />
				<ToolbarItem as={ EditorHistoryRedo } showTooltip={ true } />
				<ToolbarItem
					as={ Button }
					className="edit-post-header-toolbar__list-view-toggle"
					icon={ listView }
					isPressed={ isListViewOpen }
					/* translators: button label text should, if possible, be under 16 characters. */
					label={ __( 'List View', 'iconvert-email-marketer' ) }
					onClick={ toggleListView }
					shortcut={ listViewShortcut }
					showTooltip={ true }
				/>
			</div>
		</NavigableToolbar>
	);
}

export default HeaderToolbar;
