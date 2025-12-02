/**
 * External dependencies
 */
import { map, size, without } from 'lodash';

/**
 * WordPress dependencies
 */
import { store as blocksStore } from '@wordpress/blocks';
import { SlotFillProvider } from '@wordpress/components';
import { useEntityBlockEditor } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { ErrorBoundary, PostLockedModal } from '@wordpress/editor';
import { StrictMode, useMemo } from '@wordpress/element';
import { ShortcutProvider } from '@wordpress/keyboard-shortcuts';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import { BlockEditorProvider } from '@wordpress/block-editor';
import Layout from './components/layout';
import './hooks';
import { store as editPostStore } from './store';
import { PostProvider } from './post-provider';

function Editor({ settings }) {
	const {
		hasFixedToolbar,
		focusMode,
		hasReducedUI,
		preferredStyleVariations,
		hiddenBlockTypes,
		blockTypes,
		keepCaretInsideBlock,
	} = useSelect((select) => {
		const { isFeatureActive, getHiddenBlockTypes } = select(editPostStore);
		const { getBlockTypes } = select(blocksStore);

		return {
			hasFixedToolbar: false,
			focusMode: false,
			hasReducedUI: false,
			hasThemeStyles: false,
			preferredStyleVariations: select(preferencesStore).get(
				'ic/edit-mail',
				'preferredStyleVariations'
			),
			hiddenBlockTypes: getHiddenBlockTypes(),
			blockTypes: getBlockTypes(),
			keepCaretInsideBlock: isFeatureActive('keepCaretInsideBlock'),
		};
	}, []);

	const { updatePreferredStyleVariations, setIsInserterOpened } =
		useDispatch(editPostStore);

	const editorSettings = useMemo(() => {
		const result = {
			...settings,
			__experimentalPreferredStyleVariations: {
				value: preferredStyleVariations,
				onChange: updatePreferredStyleVariations,
			},
			hasFixedToolbar,
			focusMode,
			hasReducedUI,

			// This is marked as experimental to give time for the quick inserter to mature.
			__experimentalSetIsInserterOpened: setIsInserterOpened,
			keepCaretInsideBlock,
			// Keep a reference of the `allowedBlockTypes` from the server to handle use cases
			// where we need to differentiate if a block is disabled by the user or some plugin.
			defaultAllowedBlockTypes: settings.allowedBlockTypes,
		};

		// Omit hidden block types if exists and non-empty.
		if (size(hiddenBlockTypes) > 0) {
			// Defer to passed setting for `allowedBlockTypes` if provided as
			// anything other than `true` (where `true` is equivalent to allow
			// all block types).
			const defaultAllowedBlockTypes =
				true === settings.allowedBlockTypes
					? map(blockTypes, 'name')
					: settings.allowedBlockTypes || [];

			result.allowedBlockTypes = without(
				defaultAllowedBlockTypes,
				...hiddenBlockTypes
			);
		}

		return result;
	}, [
		settings,
		hasFixedToolbar,
		focusMode,
		hasReducedUI,
		hiddenBlockTypes,
		blockTypes,
		preferredStyleVariations,
		setIsInserterOpened,
		updatePreferredStyleVariations,
		keepCaretInsideBlock,
	]);

	const editorPostProvider = useMemo(
		() => ({
			postType: settings?.entityData?.postType,
			id: settings?.entityData?.id || settings?.post?.id,
		}),
		[]
	);

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		'postType',
		editorPostProvider.postType,
		{
			id: editorPostProvider.id,
		}
	);

	return (
		<PostProvider value={editorPostProvider}>
			<StrictMode>
				<ShortcutProvider>
					<SlotFillProvider>
						<BlockEditorProvider
							value={blocks}
							onInput={onInput}
							onChange={onChange}
							settings={{
								...editorSettings,
							}}
							useSubRegistry={false}
						>
							<ErrorBoundary>
								<Layout />
							</ErrorBoundary>
							<PostLockedModal />
						</BlockEditorProvider>
					</SlotFillProvider>
				</ShortcutProvider>
			</StrictMode>
		</PostProvider>
	);
}

export default Editor;
