/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { BlockBreadcrumb, BlockStyles } from '@wordpress/block-editor';
import { Button, Popover } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	AutosaveMonitor,
	EditorKeyboardShortcutsRegister,
	EditorNotices,
	EditorSnackbars,
	LocalAutosaveMonitor,
	UnsavedChangesWarning,
	store as editorStore,
} from '@wordpress/editor';
import { __, sprintf } from '@wordpress/i18n';
import {
	ComplementaryArea,
	FullscreenMode,
	InterfaceSkeleton,
	store as interfaceStore,
} from '@wordpress/interface';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { store as noticesStore } from '@wordpress/notices';
import { PluginArea } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../store';
import Header from '../header';
import KeyboardShortcutHelpModal from '../keyboard-shortcut-help-modal';
import EditPostKeyboardShortcuts from '../keyboard-shortcuts';
import InserterSidebar from '../secondary-sidebar/inserter-sidebar';
import SettingsSidebar from '../sidebar/settings-sidebar';
import VisualEditor from '../visual-editor';

const interfaceLabels = {
	/* translators: accessibility text for the editor top bar landmark region. */
	header: __( 'Editor top bar', 'iconvert-email-marketer' ),
	/* translators: accessibility text for the editor content landmark region. */
	body: __( 'Editor content', 'iconvert-email-marketer' ),
	/* translators: accessibility text for the editor settings landmark region. */
	sidebar: __( 'Editor settings', 'iconvert-email-marketer' ),
	/* translators: accessibility text for the editor publish landmark region. */
	actions: __( 'Editor publish', 'iconvert-email-marketer' ),
	/* translators: accessibility text for the editor footer landmark region. */
	footer: __( 'Editor footer', 'iconvert-email-marketer' ),
};

function Layout() {
	const isMobileViewport = useViewportMatch( 'medium', '<' );
	const { openGeneralSidebar, closeGeneralSidebar, setIsInserterOpened } =
		useDispatch( editPostStore );
	const { createErrorNotice } = useDispatch( noticesStore );
	const {
		sidebarIsOpened,
		previousShortcut,
		nextShortcut,
		hasBlockSelected,
		isInserterOpened,
		showIconLabels,
	} = useSelect( ( select ) => {
		const { getPostTypeLabel } = select( editorStore );
		const postTypeLabel = getPostTypeLabel();

		return {
			sidebarIsOpened: !! select(
				interfaceStore
			).getActiveComplementaryArea( editPostStore.name ),
			isInserterOpened: select( editPostStore ).isInserterOpened(),

			previousShortcut: select(
				keyboardShortcutsStore
			).getAllShortcutKeyCombinations( 'ic/edit-mail/previous-region' ),
			nextShortcut: select(
				keyboardShortcutsStore
			).getAllShortcutKeyCombinations( 'ic/edit-mail/next-region' ),
			showIconLabels:
				select( editPostStore ).isFeatureActive( 'showIconLabels' ),
			hasReducedUI:
				select( editPostStore ).isFeatureActive( 'reducedUI' ),
		};
	}, [] );
	const className = classnames( 'edit-post-layout', 'is-mode-visual', {
		'is-sidebar-opened': sidebarIsOpened,
		'show-icon-labels': showIconLabels,
	} );
	const openSidebarPanel = () =>
		openGeneralSidebar(
			hasBlockSelected ? 'edit-post/block' : 'edit-post/document'
		);

	const secondarySidebarLabel = __( 'Block Library', 'iconvert-email-marketer' );

	function onPluginAreaError( name ) {
		createErrorNotice(
			sprintf(
				/* translators: %s: plugin name */
				__(
					'The "%s" plugin has encountered an error and cannot be rendered.',
					'iconvert-email-marketer'
				),
				name
			)
		);
	}

	return (
		<>
			<FullscreenMode isActive={ true } />
			<UnsavedChangesWarning />
			<AutosaveMonitor />
			<LocalAutosaveMonitor />
			<EditPostKeyboardShortcuts />
			<EditorKeyboardShortcutsRegister />
			<SettingsSidebar />
			<InterfaceSkeleton
				className={ className }
				labels={ {
					...interfaceLabels,
					secondarySidebar: secondarySidebarLabel,
				} }
				header={ <Header /> }
				secondarySidebar={
					isInserterOpened && (
						<div className={ 'kubio-sidebar' }>
							{ <InserterSidebar /> }
						</div>
					)
				}
				sidebar={
					( ! isMobileViewport || sidebarIsOpened ) && (
						<div className={ 'kubio-sidebar' }>
							{ <ComplementaryArea.Slot scope="ic/edit-mail" /> }
						</div>
					)
				}
				notices={ <EditorSnackbars /> }
				content={
					<>
						<EditorNotices />
						<VisualEditor />
						{ /* <BlockStyles.Slot scope="core/block-inspector" /> */ }
					</>
				}
				footer={
					<div className="edit-post-layout__footer">
						{
							<BlockBreadcrumb
								rootLabelText={ __(
									'Body',
									'iconvert-email-marketer'
								) }
							/>
						}
					</div>
				}
				shortcuts={ {
					previous: previousShortcut,
					next: nextShortcut,
				} }
			/>
			<KeyboardShortcutHelpModal />
			<Popover.Slot />
			<PluginArea onError={ onPluginAreaError } />
		</>
	);
}

export default Layout;
