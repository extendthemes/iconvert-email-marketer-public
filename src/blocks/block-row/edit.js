/**
 * External dependencies
 */
import { Background } from '@iconvertem/components/common/panel/background';
import { BackgroundBlock } from '@iconvertem/components/common/panel/backgroundBlock';
import { TypographyControl } from '@iconvertem/components/common/panel/typografy';
import styleParser from '@iconvertem/components/common/utility/styleParser';
import { Fragment, useEffect } from '@wordpress/element';
import classnames from 'classnames';
import { dropRight, get, times, isNull } from 'lodash';
import { BorderControl } from '@iconvertem/components/common/panel/border';
import { usePostProviderContext } from '../../edit-mail/post-provider';
import { SpacingControl } from '@iconvertem/components/common/panel/spacing';

/**
 * Internal dependencies
 */
import {
	hasExplicitPercentColumnWidths,
	getMappedColumnWidths,
	getRedistributedColumnWidths,
	toWidthPrecision,
} from './utils';

import { DataProvider } from '../blocks';
import blockJson from './block.json';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose, createHigherOrderComponent } from '@wordpress/compose';
import { ToggleControl } from '@wordpress/components';
import {
	InspectorControls,
	useInnerBlocksProps as __stableUseInnerBlocksProps,
	__experimentalUseInnerBlocksProps,
	BlockControls,
	BlockVerticalAlignmentToolbar,
	__experimentalBlockVariationPicker,
	useBlockProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	withDispatch,
	useDispatch,
	useSelect,
	dispatch,
} from '@wordpress/data';
import {
	createBlock,
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

/**
 * Kubio dependencies
 */
import {
	KubioPanelBody,
	RangeWithUnitControl,
	SeparatorHorizontalLine,
} from '@kubio/controls';

import { Tab } from '../../components/tab';
/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In columns block, the only block we allow is 'extendstudio/row'.
 *
 * @constant
 * @type {string[]}
 */
const ALLOWED_BLOCKS = ['extendstudio/cell'];

function ColumnsEditContainer(props) {
	const {
		attributes,
		setAttributes,
		updateAlignment,
		updateColumns,
		clientId,
		style,
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

	const { count, mailContainerBlock } = useSelect(
		(select) => {
			const { getBlockCount, getBlock, getBlockRootClientId } =
				select(blockEditorStore);
			const parentClientId = getBlockRootClientId(clientId);
			let mailContainerBlock = null;
			if (parentClientId) {
				mailContainerBlock = getBlock(parentClientId);
			}

			return {
				count: getBlockCount(clientId),
				mailContainerBlock,
			};
		},
		[clientId]
	);

	const classes = classnames('row-wrapper-content', {
		[`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
		[`is-not-stacked-on-mobile`]: !isStackedOnMobile,
		'block-row': true,
	});

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
	const mailContainerMaxWidth =
		mailContainerBlock?.attributes?._style?.defaultRowWidth;
	useEffect(() => {
		dispatch('core/block-editor').__unstableMarkNextChangeAsNotPersistent();

		//this should be done only once at insertion. it copies the value from the container
		if (mailContainerMaxWidth && !maxWidth?.updatedAtInsert) {
			setAttributes({
				maxWidth: { ...mailContainerMaxWidth, updatedAtInsert: true },
			});
		}
	}, [maxWidth]);

	const getValueRowWidth = () => {
		if (maxWidth && isNull(maxWidth.value) && mailContainerMaxWidth) {
			return mailContainerMaxWidth;
		}

		return maxWidth;
	};

	const getValueMaxWidth = () => {
		if (maxWidth && isNull(maxWidth.value)) {
			return style?.defaultRowWidth;
		}

		return maxWidth;
	};

	const layoutTab = (
		<KubioPanelBody
			title={__('Layout', 'iconvert-email-marketer')}
			initialOpen={true}
		>
			<RangeWithUnitControl
				label={__('Width', 'iconvert-email-marketer')}
				labelPosition="edge"
				value={getValueRowWidth()}
				onChange={(nextWidth) => {
					nextWidth = 0 > parseFloat(nextWidth) ? '0' : nextWidth;
					setAttributes({ maxWidth: nextWidth });
				}}
				units={[
					{
						value: 'px',
						label: 'px',
						default: 0,
						a11yLabel: __('pixels', 'iconvert-email-marketer'),
					},
					{
						value: '%',
						label: '%',
						default: 0,
						a11yLabel: __('percent', 'iconvert-email-marketer'),
					},
				]}
				capMin
				min={0}
				max={maxWidth.unit === '%' ? 100 : 600}
			/>
			<ToggleControl
				label={__('Stack on mobile', 'iconvert-email-marketer')}
				checked={isStackedOnMobile}
				onChange={() =>
					setAttributes({
						isStackedOnMobile: !isStackedOnMobile,
					})
				}
			/>
		</KubioPanelBody>
	);

	const styleTab = (
		<KubioPanelBody
			title={__('Style', 'iconvert-email-marketer')}
			initialOpen={true}
		>
			<DataProvider.Provider
				value={{ blockJson, attributes, setAttributes }}
			>
				<BackgroundBlock
					labelBackground={__(
						'Background row',
						'iconvert-email-marketer'
					)}
					supportsImage
				/>
				<Background
					labelBackground={__(
						'Background content',
						'iconvert-email-marketer'
					)}
					supportsImage
				/>
				<TypographyControl
					typoLabel={__('Typography', 'iconvert-email-marketer')}
					textColorLabel={__('Text color', 'iconvert-email-marketer')}
				/>
				<SeparatorHorizontalLine />
				<BorderControl
					labelBorder={__('Border', 'iconvert-email-marketer')}
				/>
				<SeparatorHorizontalLine />
				<SpacingControl
					labelSpacing={__('Spacing', 'iconvert-email-marketer')}
					_element={'block'}
					property={'margin'}
				/>
			</DataProvider.Provider>
		</KubioPanelBody>
	);

	return (
		<Fragment>
			<BlockControls>
				<BlockVerticalAlignmentToolbar
					onChange={updateAlignment}
					value={verticalAlignment}
				/>
			</BlockControls>
			<InspectorControls>
				<Tab
					tabs={[
						{
							name: 'layout',
							title: 'Layout',
							component: layoutTab,
						},
						{
							name: 'style',
							title: 'Style',
							component: styleTab,
						},
					]}
				/>
			</InspectorControls>
			<table
				{...blockProps}
				align={'center'}
				width={'100%'}
				border={0}
				cellPadding={0}
				cellSpacing={0}
				role={'presentation'}
				style={{
					msoTableLspace: '0pt',
					msoTableRspace: '0pt',
					margin: '0 auto 0 auto',
					width: '100%',
					minWidth: '100%',

					...styleParser(_styleBlock),
				}}
			>
				<tbody>
					<tr>
						<td>
							<table
								className="row-content stack"
								align={'center'}
								border={0}
								cellPadding={0}
								cellSpacing={0}
								role={'presentation'}
								width={maxWidth.value + maxWidth.unit}
								style={{
									msoTableLspace: '0pt',
									msoTableRspace: '0pt',
									maxWidth: maxWidth.value + maxWidth.unit,
									width: maxWidth.value + maxWidth.unit,

									...styleParser(_style),
								}}
							>
								<tbody>
									<tr {...innerBlocksProps} />
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</Fragment>
	);
}

const ColumnsEditContainerWrapper = compose(
	withDispatch((dispatch, ownProps, registry) => ({
		/**
		 * Update all child Column blocks with a new vertical alignment setting
		 * based on whatever alignment is passed in. This allows change to parent
		 * to overide anything set on a individual column basis.
		 *
		 * @param {string} verticalAlignment the vertical alignment setting
		 */
		updateAlignment(verticalAlignment) {
			const { clientId, setAttributes } = ownProps;
			const { updateBlockAttributes } = dispatch(blockEditorStore);
			const { getBlockOrder } = registry.select(blockEditorStore);

			// Update own alignment.
			setAttributes({ verticalAlignment });

			// Update all child Column Blocks to match
			const innerBlockClientIds = getBlockOrder(clientId);
			innerBlockClientIds.forEach((innerBlockClientId) => {
				updateBlockAttributes(innerBlockClientId, {
					verticalAlignment,
				});
			});
		},

		/**
		 * Updates the column count, including necessary revisions to child Column
		 * blocks to grant required or redistribute available space.
		 *
		 * @param {number} previousRows Previous column count.
		 * @param {number} newRows      New column count.
		 */
		updateColumns(previousRows, newRows) {
			const { clientId } = ownProps;
			const { replaceInnerBlocks } = dispatch(blockEditorStore);
			const { getBlocks } = registry.select(blockEditorStore);

			let innerBlocks = getBlocks(clientId);
			const hasExplicitWidths =
				hasExplicitPercentColumnWidths(innerBlocks);

			// Redistribute available width for existing inner blocks.
			const isAddingRow = newRows > previousRows;

			if (isAddingRow && hasExplicitWidths) {
				// If adding a new column, assign width to the new column equal to
				// as if it were `1 / columns` of the total available space.
				const newRowWidth = toWidthPrecision(100 / newRows);

				// Redistribute in consideration of pending block insertion as
				// constraining the available working width.
				const widths = getRedistributedColumnWidths(
					innerBlocks,
					100 - newRowWidth
				);

				innerBlocks = [
					...getMappedColumnWidths(innerBlocks, widths),
					...times(newRows - previousRows, () => {
						return createBlock('extendstudio/cell', {
							width: `${newRowWidth}%`,
						});
					}),
				];
			} else if (isAddingRow) {
				innerBlocks = [
					...innerBlocks,
					...times(newRows - previousRows, () => {
						return createBlock('extendstudio/cell');
					}),
				];
			} else {
				// The removed column will be the last of the inner blocks.
				innerBlocks = dropRight(innerBlocks, previousRows - newRows);

				if (hasExplicitWidths) {
					// Redistribute as if block is already removed.
					const widths = getRedistributedColumnWidths(
						innerBlocks,
						100
					);

					innerBlocks = getMappedColumnWidths(innerBlocks, widths);
				}
			}

			replaceInnerBlocks(clientId, innerBlocks);
		},
	})),
	createHigherOrderComponent(
		(WrappedComponent) => (props) => {
			const postData = usePostProviderContext();
			return <WrappedComponent {...props} postData={postData} />;
		},
		'withPostData'
	)
)(ColumnsEditContainer);

function Placeholder({ clientId, name, setAttributes }) {
	const { blockType, defaultVariation, variations } = useSelect(
		(select) => {
			const {
				getBlockVariations,
				getBlockType,
				getDefaultBlockVariation,
			} = select(blocksStore);

			return {
				blockType: getBlockType(name),
				defaultVariation: getDefaultBlockVariation(name, 'block'),
				variations: getBlockVariations(name, 'block'),
			};
		},
		[name]
	);
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);
	const blockProps = useBlockProps();

	return (
		<table {...blockProps} style={{ width: '100%' }}>
			<tbody>
				<tr>
					<td>
						<div className="mail-row-placeholder-wrapper">
							<__experimentalBlockVariationPicker
								icon={get(blockType, ['icon', 'src'])}
								label={get(blockType, ['title'])}
								variations={variations}
								onSelect={(
									nextVariation = defaultVariation
								) => {
									if (nextVariation.attributes) {
										setAttributes(nextVariation.attributes);
									}
									if (nextVariation.innerBlocks) {
										replaceInnerBlocks(
											clientId,
											createBlocksFromInnerBlocksTemplate(
												nextVariation.innerBlocks
											),
											true
										);
									}
								}}
							/>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	);
}

const ColumnsEdit = (props) => {
	const { clientId } = props;

	const hasInnerBlocks = useSelect(
		(select) => select(blockEditorStore).getBlocks(clientId).length > 0,
		[clientId]
	);

	const Component = hasInnerBlocks
		? ColumnsEditContainerWrapper
		: Placeholder;

	return <Component {...props} />;
};

export default ColumnsEdit;
