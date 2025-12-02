/**
 * External dependencies
 */
import { Fragment } from '@wordpress/element';
import classnames from 'classnames';
import { Background } from '@iconvertem/components/common/panel/background';
import { TextAlignControl } from '@iconvertem/components/common/panel/textAlign';
import { TypographyControl } from '@iconvertem/components/common/panel/typografy';
import { VerticalAlignControl } from '@iconvertem/components/common/panel/vertical-align-control.js';
import styleParser from '@iconvertem/components/common/utility/styleParser';

import { BorderControl } from '@iconvertem/components/common/panel/border';
import { SpacingControl } from '@iconvertem/components/common/panel/spacing';

/**
 * WordPress dependencies
 */
import {
	BlockControls,
	BlockVerticalAlignmentToolbar,
	InnerBlocks,
	InspectorControls,
	__experimentalUseInnerBlocksProps,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';

import {
	KubioPanelBody,
	RangeControl,
	SeparatorHorizontalLine,
} from '@kubio/controls';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { sum } from 'lodash';
import { DataProvider } from '../blocks';
import blockJson from './block.json';

const ALLOWED_BLOCKS = [
	'extendstudio/button',
	'extendstudio/divider',
	'extendstudio/html',
	'extendstudio/image',
	'extendstudio/social-icons',
	'extendstudio/text',
	'extendstudio/heading',
	'extendstudio/video',
	'extendstudio/countdown',
	'extendstudio/recommended-product',
	'extendstudio/ordered-products',
	'extendstudio/order-note',
	'extendstudio/billing-address',
	'extendstudio/shipping-address',
	'extendstudio/related-products',
];

const WidthControl = ( { attributes, setAttributes, maxWidth } ) => {
	return (
		<RangeControl
			capMin={ true }
			capMax={ true }
			min={ 1 }
			max={ maxWidth }
			step={ 1 }
			label={ __( 'Width', 'iconvert-email-marketer' ) }
			value={ Math.ceil( parseFloat( attributes.width ) ) || maxWidth }
			onChange={ ( next ) =>
				setAttributes( {
					width: next - 0.01 + '%',
					[ `___${ Date.now() }` ]: Date.now(),
				} )
			}
		/>
	);
};

function ColumnEdit( { attributes, setAttributes, clientId } ) {
	const useInnerBlocksProps = __stableUseInnerBlocksProps
		? __stableUseInnerBlocksProps
		: __experimentalUseInnerBlocksProps;
	const {
		verticalAlignment,
		width,
		templateLock = false,
		_style,
	} = attributes;
	const classes = classnames();

	const { columnsIds, hasChildBlocks, rootClientId, maxWidth } = useSelect(
		( select ) => {
			const { getBlockOrder, getBlockRootClientId, getBlocks } =
				select( blockEditorStore );

			const rootId = getBlockRootClientId( clientId );
			const widths = getBlocks( rootId ).map( ( block ) => {
				if ( block.clientId === clientId ) {
					return 0;
				}

				return Math.ceil( parseFloat( block.attributes.width ) ) || 0;
			} );

			return {
				hasChildBlocks: getBlockOrder( clientId ).length > 0,
				rootClientId: rootId,
				columnsIds: getBlockOrder( rootId ),
				maxWidth: 100 - sum( widths ),
			};
		},
		[ clientId ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const updateAlignment = ( value ) => {
		// Update own alignment.
		setAttributes( { verticalAlignment: value } );
		// Reset parent Columns block.
		updateBlockAttributes( rootClientId, {
			verticalAlignment: null,
		} );
	};

	const widthWithUnit = Number.isFinite( width ) ? width + '%' : width;
	const blockProps = useBlockProps( {
		className: classes,
		style: widthWithUnit ? { width: widthWithUnit } : undefined,
	} );

	const columnsCount = columnsIds.length;
	const currentColumnPosition = columnsIds.indexOf( clientId ) + 1;

	const label = sprintf(
		/* translators: 1: Block label (i.e. "Block: Column"), 2: Position of the selected block, 3: Total number of sibling blocks of the same type */
		__( '%1$s (%2$d of %3$d)', 'iconvert-email-marketer' ),
		blockProps[ 'aria-label' ],
		currentColumnPosition,
		columnsCount
	);

	const innerBlocksProps = useInnerBlocksProps(
		{ ...blockProps, 'aria-label': label },
		{
			templateLock,
			allowedBlocks: ALLOWED_BLOCKS,
			renderAppender: hasChildBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	return (
		<Fragment>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={ updateAlignment }
					value={ verticalAlignment }
				/>
			</BlockControls>
			<InspectorControls>
				<KubioPanelBody initialOpen={ true }>
					<DataProvider.Provider
						value={ { blockJson, attributes, setAttributes } }
					>
						<Background
							supportsImage={ true }
							label={ __( 'Background', 'iconvert-email-marketer' ) }
						/>
						<TypographyControl />
						<TextAlignControl />
						<VerticalAlignControl />
						<SeparatorHorizontalLine />
						<BorderControl />
						<SpacingControl />
						<SeparatorHorizontalLine />
						{ columnsIds.length > 1 && (
							<>
								<WidthControl
									attributes={ attributes }
									setAttributes={ setAttributes }
									maxWidth={ maxWidth }
								/>
								<p
									style={ { fontSize: '12px' } }
									className="description notice notice-alt"
								>
									{ sprintf(
										// translators: %s column width in percent
										__(
											'Max width available is %s. To make the column bigger, adjust the sibling columns first',
											'iconvert-email-marketer'
										),
										maxWidth + '%'
									) }
								</p>
							</>
						) }
						{ columnsIds.length <= 1 && (
							<p
								style={ { fontSize: '12px' } }
								className="description notice notice-alt notice-info"
							>
								{ __(
									'Rows with a single column do not allow specifying a custom column width',
									'iconvert-email-marketer'
								) }
							</p>
						) }
					</DataProvider.Provider>
				</KubioPanelBody>
			</InspectorControls>
			<td
				{ ...innerBlocksProps }
				style={ { width, ...styleParser( _style ) } }
				width={ width }
			/>
		</Fragment>
	);
}

export default ColumnEdit;
