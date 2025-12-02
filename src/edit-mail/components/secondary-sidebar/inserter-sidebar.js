/**
 * WordPress dependencies
 */
import { __experimentalLibrary as Library } from '@wordpress/block-editor';
import { __experimentalUseDialog as useDialog } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { store as editPostStore } from '../../store';

export default function InserterSidebar() {
	const { insertionPoint } = useSelect( ( select ) => {
		const { __experimentalGetInsertionPoint } = select( editPostStore );
		return {
			insertionPoint: __experimentalGetInsertionPoint(),
		};
	}, [] );
	const { setIsInserterOpened } = useDispatch( editPostStore );

	const [ inserterDialogRef, inserterDialogProps ] = useDialog( {
		onClose: () => setIsInserterOpened( false ),
		focusOnMount: null,
	} );

	// const libraryRef = useRef();
	// useEffect( () => {
	// 	libraryRef.current.focusSearch();
	// }, [] );

	return (
		<div
			ref={ inserterDialogRef }
			{ ...inserterDialogProps }
			className="edit-post-editor__inserter-panel"
		>
			<div className="edit-post-editor__inserter-panel-content">
				<Library
					showMostUsedBlocks={ false }
					showInserterHelpPanel={ false }
					shouldFocusBlock={ true }
					rootClientId={ insertionPoint.rootClientId }
					__experimentalInsertionIndex={
						insertionPoint.insertionIndex
					}
					__experimentalFilterValue={ insertionPoint.filterValue }
					// ref={ libraryRef }
				/>
			</div>
		</div>
	);
}
