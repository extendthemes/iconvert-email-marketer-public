/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { ComplementaryArea } from '@wordpress/interface';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../../store';

export default function PluginSidebarEditPost({ className, ...props }) {
	const { postTitle, shortcut, showIconLabels } = useSelect((select) => {
		return {
			postTitle: select(editorStore).getEditedPostAttribute('title'),
			shortcut: select(keyboardShortcutsStore).getShortcutRepresentation(
				'ic/edit-mail/toggle-sidebar'
			),
			showIconLabels:
				select(editPostStore).isFeatureActive('showIconLabels'),
		};
	}, []);
	return (
		<ComplementaryArea
			panelClassName={className}
			className="edit-post-sidebar"
			smallScreenTitle={postTitle || __('(no title)')}
			scope="ic/edit-mail"
			toggleShortcut={shortcut}
			showIconLabels={showIconLabels}
			{...props}
		/>
	);
}
