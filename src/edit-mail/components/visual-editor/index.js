/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	BlockList,
	BlockTools,
	// __experimentalUseNoRecursiveRenders as useNoRecursiveRenders,
	__experimentalUseResizeCanvas as useResizeCanvas,
	__unstableBlockSettingsMenuFirstItem,
	__unstableEditorStyles as EditorStyles,
	__unstableIframe as Iframe,
	__unstableUseBlockSelectionClearer as useBlockSelectionClearer,
	__unstableUseClipboardHandler as useClipboardHandler,
	__unstableUseMouseMoveTypingReset as useMouseMoveTypingReset,
	__unstableUseTypewriter as useTypewriter,
	__unstableUseTypingObserver as useTypingObserver,
} from '@wordpress/block-editor';
import { useNoRecursiveRenders } from './recursive-renders';
import { __unstableMotion as motion } from '@wordpress/components';
import { useMergeRefs } from '@wordpress/compose';
import { resolveSelect, useDispatch, useSelect } from '@wordpress/data';
import {
	store as editorStore,
	VisualEditorGlobalKeyboardShortcuts,
} from '@wordpress/editor';
import { useEffect, useRef } from '@wordpress/element';
import _ from 'lodash';
/**
 * Internal dependencies
 */
import { OwnerDocumentContext } from '@kubio/utils';
import AppendAddButton from '@iconvertem/components/common/custom-components/AppendAddButton.js';
import { store as editPostStore } from '../../store';
import BlockInspectorButton from './block-inspector-button';
import { createBlock, cloneBlock } from '@wordpress/blocks';
import { usePostProviderContext } from '@iconvertem/edit-mail/post-provider';

let appliedMoveMailContainerBlockLogic = false;
const style = {
	css: `
	* {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	}
	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		padding: 0;
	}

	a[x-apple-data-detectors] {
		color: inherit !important;
		text-decoration: inherit !important;
	}

	p {
		line-height: inherit;
	}

	@media (max-width: 620px) {
		.row-content {
			width: 100% !important;
		}

		/* stack columns on mobile */
		.stack .column {
			width: 100%;
			display: block;
		}
	}

	span.ic-mail-wc-tag {
		pointer-events: bounding-box;
		user-select: all;
	}
	`,
};

const EditorIframe = ({ children, contentRef, extraStyle }) => {
	const ref = useMouseMoveTypingReset();

	return (
		<OwnerDocumentContext.Provider
			value={contentRef?.defaultView?.ownerDocument}
		>
			<Iframe
				head={
					<>
						<meta
							name="viewport"
							content="width=device-width, initial-scale=1.0"
						/>
						<EditorStyles
							styles={[
								style,
								extraStyle ? { css: extraStyle } : null,
							].filter(Boolean)}
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
							rel="stylesheet"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
							rel="stylesheet"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
							rel="stylesheet"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
							rel="stylesheet"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap"
							rel="stylesheet"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
							rel="stylesheet"
						/>
						<link
							href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
							rel="stylesheet"
						/>
						<meta
							httpEquiv="Content-Type"
							content="text/html; charset=utf-8"
						/>
					</>
				}
				ref={ref}
				contentRef={contentRef}
				style={{ width: '100%', height: '100%', display: 'block' }}
				name="editor-canvas"
			>
				{children}
			</Iframe>
		</OwnerDocumentContext.Provider>
	);
};
const onChangeBackButtonAction = () => {
	const backButton = document.querySelector(
		'.iconvertem-template-editor-back-button'
	);
	if (!backButton) {
		return;
	}
	backButton.addEventListener(
		'click',
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			const adminUrl = iconvertemRichText?.back_button_url;
			if (!adminUrl) {
				return;
			}
			window.location = adminUrl;
		},
		true
	);
};
export default function VisualEditor() {
	const { deviceType, wrapperBlockName, wrapperUniqueId } = useSelect(
		(select) => {
			const { __experimentalGetPreviewDeviceType } =
				select(editPostStore);
			const { getCurrentPostId, getCurrentPostType } =
				select(editorStore);

			let _wrapperBlockName;

			if (getCurrentPostType() === 'wp_block') {
				_wrapperBlockName = 'core/block';
			}
			return {
				deviceType: __experimentalGetPreviewDeviceType(),
				wrapperBlockName: _wrapperBlockName,
				wrapperUniqueId: getCurrentPostId(),
			};
		},
		[]
	);

	const desktopCanvasStyles = {
		height: '100%',
		width: '100%',
		margin: 0,
		display: 'flex',
		flexFlow: 'column',
		background: 'white',
	};

	const resizedCanvasStyles = useResizeCanvas(deviceType);

	const previewMode = 'is-' + deviceType.toLowerCase() + '-preview';

	let animatedStyles = desktopCanvasStyles;
	if (resizedCanvasStyles) {
		animatedStyles = resizedCanvasStyles;
	}

	const ref = useRef();
	const contentRef = useMergeRefs([
		ref,
		useClipboardHandler(),
		useTypewriter(),
		useTypingObserver(),
		useBlockSelectionClearer(),
	]);

	useEffect(() => {
		onChangeBackButtonAction();
	}, []);

	const blockSelectionClearerRef = useBlockSelectionClearer();

	const [, RecursionProvider] = useNoRecursiveRenders(
		wrapperUniqueId,
		wrapperBlockName
	);
	const { blocks } = useSelect((select) => {
		const { getBlocks } = select('core/block-editor');
		const blocks = getBlocks();
		return {
			blocks,
			getBlocks,
		};
	}, []);

	const hasBlocks = blocks && blocks?.length !== 0;
	const { insertBlocks, replaceInnerBlocks, removeBlock, resetBlocks } =
		useDispatch('core/block-editor');
	const { saveEditedEntityRecord } = useDispatch('core');
	const postData = usePostProviderContext();
	const getGlobalStyle = async () => {
		const { getEntityRecord } = resolveSelect('core');
		const currentPost = await getEntityRecord(
			'postType',
			postData.postType,
			postData.id
		);
		const globalStyle = currentPost?.globalStyle || {};
		return globalStyle;
	};
	useEffect(() => {
		const moveBlocksToMailContainer = async () => {
			if (appliedMoveMailContainerBlockLogic) {
				return;
			}

			appliedMoveMailContainerBlockLogic = true;

			const hasMailContainer = blocks.find(
				(block) => block?.name === 'extendstudio/mail-container'
			);
			if (hasMailContainer) {
				return;
			}
			const currentGlobalStyle = await getGlobalStyle();
			let attributes = {};
			if (!_.isEmpty(currentGlobalStyle)) {
				attributes = {
					_style: currentGlobalStyle,
				};
			}
			const mailContainerBlock = createBlock(
				'extendstudio/mail-container',
				attributes
			);
			const newInnerBlocks = blocks.map((block) => cloneBlock(block));

			blocks.map((block) => removeBlock(block.clientId));
			insertBlocks(mailContainerBlock, 0);
			replaceInnerBlocks(
				mailContainerBlock.clientId,
				newInnerBlocks,
				false
			);
			saveEditedEntityRecord('postType', postData.postType, postData.id);
		};

		if (hasBlocks) {
			moveBlocksToMailContainer();
		}
	}, [hasBlocks]);

	return (
		<BlockTools
			__unstableContentRef={ref}
			className={classnames('edit-post-visual-editor')}
		>
			<VisualEditorGlobalKeyboardShortcuts />
			<motion.div
				className="edit-post-visual-editor__content-area"
				animate={{
					padding: '0',
				}}
				ref={blockSelectionClearerRef}
			>
				<motion.div
					animate={animatedStyles}
					initial={desktopCanvasStyles}
					className={previewMode}
				>
					<EditorIframe contentRef={contentRef}>
						<RecursionProvider>
							<table
								width="100%"
								border="0"
								cellPadding="0"
								cellSpacing="0"
								role="presentation"
								style={{
									minWidth: '100%',
								}}
							>
								<tbody>
									<tr>
										<td>
											<BlockList
												className={'wp-site-blocks'}
											/>
											<AppendAddButton />
										</td>
									</tr>
								</tbody>
							</table>
						</RecursionProvider>
					</EditorIframe>
				</motion.div>
			</motion.div>
			<__unstableBlockSettingsMenuFirstItem>
				{({ onClose }) => <BlockInspectorButton onClick={onClose} />}
			</__unstableBlockSettingsMenuFirstItem>
		</BlockTools>
	);
}
