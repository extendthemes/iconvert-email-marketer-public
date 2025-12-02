/**
 * WordPress dependencies
 */
import '@wordpress/editor'; // This shouldn't be necessary
import '@wordpress/format-library';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useMemo } from '@wordpress/element';
import { serialize, parse } from '@wordpress/blocks';
import { uploadMedia } from '@wordpress/media-utils';

import { useRichTextContext } from '../context';

import {
	BlockEditorKeyboardShortcuts,
	BlockEditorProvider,
	BlockList,
	BlockInspector,
	WritingFlow,
	ObserveTyping,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Sidebar from '@iconvertem/components/sidebar';

function BlockEditor( { settings: _settings } ) {
	const [ blocks, updateBlocks ] = useState( [] );
	const { createInfoNotice } = useDispatch( 'core/notices' );

	const { updateRichTextContent, richTextContent, isContentLoaded } =
		useRichTextContext();

	const canUserCreateMedia = useSelect( ( select ) => {
		const _canUserCreateMedia = select( 'core' ).canUser(
			'create',
			'media'
		);
		return _canUserCreateMedia || _canUserCreateMedia !== false;
	}, [] );

	const settings = useMemo( () => {
		if ( ! canUserCreateMedia ) {
			return _settings;
		}
		return {
			..._settings,
			mediaUpload( { onError, ...rest } ) {
				uploadMedia( {
					wpAllowedMimeTypes: _settings.allowedMimeTypes,
					onError: ( { message } ) => onError( message ),
					...rest,
				} );
			},
		};
	}, [ canUserCreateMedia, _settings ] );

	useEffect( () => {
		const storedBlocks = richTextContent;

		if ( storedBlocks?.length ) {
			handleUpdateBlocks( () => parse( storedBlocks ), false );
		}
	}, [ isContentLoaded ] );

	/**
	 * Wrapper for updating blocks. Required as `onInput` callback passed to
	 * `BlockEditorProvider` is now called with more than 1 argument. Therefore
	 * attempting to setState directly via `updateBlocks` will trigger an error
	 * in React.
	 *
	 * @param blocks
	 * @param flag
	 */
	function handleUpdateBlocks( blocks, flag ) {
		if ( flag !== false ) {
			updateRichTextContent( serialize( blocks ) );
		}

		updateBlocks( blocks );
	}

	function handleUpdateRichBlocks( blocks ) {
		updateRichTextContent( blocks );
	}

	function handlePersistBlocks( newBlocks ) {
		updateBlocks( newBlocks );
		updateRichTextContent( serialize( newBlocks ) );
	}

	return (
		<div className="cs_promorictext-block-editor">
			<BlockEditorProvider
				value={ blocks }
				onInput={ handleUpdateBlocks }
				onChange={ handlePersistBlocks }
				settings={ settings }
			>
				<Sidebar.InspectorFill>
					<BlockInspector />
				</Sidebar.InspectorFill>
				<table
					width="100%"
					border="0"
					cellPadding="0"
					cellSpacing="0"
					role="presentation"
				>
					<tbody>
						<tr>
							<td>
								<BlockEditorKeyboardShortcuts />
								<WritingFlow>
									<ObserveTyping>
										{ isContentLoaded && (
											<BlockList className="cs_promorictext-block-editor__block-list" />
										) }
										{ ! isContentLoaded && (
											<>Content loading...</>
										) }
									</ObserveTyping>
								</WritingFlow>
							</td>
						</tr>
					</tbody>
				</table>
			</BlockEditorProvider>
		</div>
	);
}

export default BlockEditor;
