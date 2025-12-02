/**
 * External dependencies
 */
import styleParser from '@iconvertem/components/common/utility/styleParser';
import { Fragment, useEffect } from '@wordpress/element';
import classnames from 'classnames';

/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */
import {
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	useBlockProps,
} from '@wordpress/block-editor';
import { useDispatch } from '@wordpress/data';

/**
 * Kubio dependencies
 */

import { Content } from './inspector/content';
/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In columns block, the only block we allow is 'extendstudio/mail-container'.
 *
 * @constant
 * @type {string[]}
 */
const ALLOWED_BLOCKS = ['extendstudio/row'];

function MailContainerEdit(props) {
	const {
		attributes,
		setAttributes,
		updateAlignment,
		updateColumns,
		clientId,

		isSelected,
	} = props;
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;
	const {
		isStackedOnMobile,
		verticalAlignment,
		_style,
		_styleBlock,
		maxWidth,
	} = attributes;
	const { clearSelectedBlock } = useDispatch('core/block-editor');

	useEffect(() => {
		if (isSelected) {
			clearSelectedBlock();
		}
	}, [isSelected]);

	const classes = classnames(
		'row-wrapper-content',
		'nl-container',
		'block-mail-container'
	);

	const blockProps = useBlockProps({
		className: classes,
		style: _style,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: 'horizontal',
			renderAppender: false,
		}
	);

	return (
		<Fragment>
			<Content
				attributes={attributes}
				setAttributes={setAttributes}
				clientId={clientId}
			/>
			<table
				{...blockProps}
				width="100%"
				border="0"
				cellPadding="0"
				cellSpacing="0"
				role="presentation"
				style={{
					minWidth: '100%',
					...styleParser(_style),
				}}
			>
				<tbody>
					<tr>
						<td {...innerBlocksProps}></td>
					</tr>
				</tbody>
			</table>
		</Fragment>
	);
}

export default MailContainerEdit;
