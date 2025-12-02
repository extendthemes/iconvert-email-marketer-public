import blockJson from '../block.json';
import { __ } from '@wordpress/i18n';
import { DataProvider } from '../../blocks';
import { InspectorControls } from '@wordpress/block-editor';
import {
	ColorIndicatorPopover,
	KubioPanelBody,
	MediaPicker,
	RangeWithUnitControl,
	TypographyControlPopup,
} from '@kubio/controls';
import { Fragment } from '@wordpress/element';
import { useBlockData } from '@iconvertem/core';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';

const Content = ({ attributes, setAttributes, clientId }) => {
	return (
		<>
			<InspectorControls>
				<KubioPanelBody initialOpen={true}>
					<MailContainerContentTabControls
						attributes={attributes}
						mailContainerClientId={clientId}
						setAttributes={setAttributes}
					/>
				</KubioPanelBody>
			</InspectorControls>
		</>
	);
};
const MailContainerContentTabControls = ({
	attributes,
	setAttributes,
	mailContainerClientId,
}) => {
	return (
		<>
			<DataProvider.Provider
				value={{ blockJson, attributes, setAttributes }}
			>
				<MailContainerContentTabControlsInner
					attributes={attributes}
					setAttributes={setAttributes}
					mailContainerClientId={mailContainerClientId}
				/>
			</DataProvider.Provider>
		</>
	);
};
const MailContainerContentTabControlsInner_ = ({ updateBlockRowWidth }) => {
	const getData = useBlockData('');
	const defaultRowWidth = getData('defaultRowWidth');
	const backgroundColor = getData('background');
	const backgroundImage = getData('backgroundImage');

	const backgroundImageOnChange = (next) => {
		backgroundImage.onChange(next.url || '');
	};
	return (
		<>
			<ColorIndicatorPopover
				label={__('Background color', 'iconvert-email-marketer')}
				{...backgroundColor}
				showReset={true}
			/>
			<MediaPicker
				type={'image'}
				buttonLabel={__('Background image', 'iconvert-email-marketer')}
				showButton
				showRemoveButton
				removeButtonLabel={__('Reset image', 'iconvert-email-marketer')}
				{...backgroundImage}
				onChange={backgroundImageOnChange}
			/>
			<ColorIndicatorPopover
				label={__('Text color', 'iconvert-email-marketer')}
				{...getData('typography.color')}
				showReset={true}
			/>

			{/*<ColorIndicatorPopover*/}
			{/*	label={__('Link color', 'iconvert-email-marketer')}*/}
			{/*	{...getData('linkColor')}*/}
			{/*/>*/}

			<TypographyControlPopup
				label={__('Typography', 'iconvert-email-marketer')}
				{...getData('typography')}
			/>
			<RangeWithUnitControl
				label={__('Page Width', 'iconvert-email-marketer')}
				labelPosition="edge"
				value={defaultRowWidth.value || { value: 600, unit: 'px' }}
				onChange={(nextWidth) => {
					nextWidth = 0 > parseFloat(nextWidth) ? '0' : nextWidth;
					defaultRowWidth.onChange(nextWidth);
					updateBlockRowWidth(nextWidth);
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
				max={defaultRowWidth?.unit === '%' ? 100 : 600}
				onReset={() => {
					const nextWidth = { value: 600, unit: 'px' };
					defaultRowWidth.onChange(nextWidth);
					updateBlockRowWidth(nextWidth);
				}}
			/>
		</>
	);
};

const MailContainerContentTabControlsInner = compose(
	withSelect((select, { mailContainerClientId }) => {
		const { getBlock } = select('core/block-editor') || {};
		const mailContainerBlock = getBlock?.(mailContainerClientId) || [];
		const mailContainerInnerBlocks = mailContainerBlock?.innerBlocks || [];
		const rowBlocks =
			mailContainerInnerBlocks?.filter?.(
				(block) => block.name === 'extendstudio/row'
			) || [];

		return { rowBlocks };
	}),
	withDispatch((dispatch, { rowBlocks }) => {
		const { updateBlockAttributes } = dispatch('core/block-editor');

		const updateBlockRowWidth = (nextValue) => {
			const updates = [];

			rowBlocks.forEach((row) => {
				updates.push({
					id: row.clientId,
					attributes: {
						maxWidth: nextValue,
					},
				});
			});

			updateBlockAttributes(
				updates.map((item) => item.id),
				updates.reduce(
					(acc, item) => ({
						...acc,
						[item.id]: item.attributes,
					}),
					{}
				),
				true
			);
		};

		return { updateBlockRowWidth };
	})
)(MailContainerContentTabControlsInner_);
export { MailContainerContentTabControls, Content };
