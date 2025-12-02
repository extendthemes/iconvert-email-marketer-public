import { Fragment, useState } from '@wordpress/element';
import { Background } from '@iconvertem/components/common/panel/background';
import { BorderControl } from '@iconvertem/components/common/panel/border';
import { TypographyControl } from '@iconvertem/components/common/panel/typografy';
import { SpacingBlockControl } from '@iconvertem/components/common/panel/spacingBlock';
import { TextAlignBlockControl } from '@iconvertem/components/common/panel/textAlignBlock';
import { SpacingControl } from '@iconvertem/components/common/panel/spacing';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import {
	InputControl,
	KubioPanelBody,
	ToggleControl,
	UnitControl,
} from '@kubio/controls';
import styleParser from '@iconvertem/components/common/utility/styleParser';
import { DataProvider } from '../blocks';
import blockJson from './block.json';
import { Tab } from '@iconvertem/components/tab.js';
import { SelectControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';

export default function Button({ attributes, setAttributes }) {
	const { __unstableMarkLastChangeAsPersistent } =
		useDispatch('core/block-editor');
	const isWoocommerceActive = useSelect((select) => {
		const { is_woocommerce_active } =
			select('core/block-editor').getSettings();
		return is_woocommerce_active;
	}, []);
	const { content, link, wc_link, _style, _styleBlock } = attributes;
	const blockProps = useBlockProps({ className: 'button_block' });
	const { width } = _style;
	const [widthAutoEnabled, setWidthAutoEnabled] = useState(width === 'auto');

	const setStyle = (path) => (newValue) => {
		const payload = {
			..._style,
			[path]: newValue,
		};
		setAttributes({ _style: payload });
	};
	const handleFormCheckAuto = (value) => {
		if (value) {
			setStyle('width')('auto');
		} else {
			setStyle('width')('');
		}
		setWidthAutoEnabled(value);
	};

	const onWidthChange = (newVal) => {
		let { value, unit } = newVal;

		if (!unit) {
			unit = 'px';
		}

		setStyle('width')(value + unit);
	};

	const propertiesTab = (
		<KubioPanelBody initialOpen={true}>
			{isWoocommerceActive && (
				<SelectControl
					label="Link value"
					value={wc_link}
					options={[
						{ label: 'Reset password', value: 'reset_password' },
						{ label: 'My account', value: 'my_account' },
						{ label: 'Order', value: 'order' },
						{ label: 'Store', value: 'store' },
						{ label: 'Cart', value: 'cart' },
						{ label: 'Custom', value: 'custom' },
					]}
					onChange={(newValue) => {
						__unstableMarkLastChangeAsPersistent();
						setAttributes({ wc_link: newValue });
					}}
				/>
			)}
			{wc_link === 'custom' && (
				<InputControl
					label={__('Button link', 'iconvert-email-marketer')}
					value={link}
					onChange={(value) => setAttributes({ link: value })}
				/>
			)}
			<ToggleControl
				label={'Width auto'}
				value={widthAutoEnabled}
				onChange={(state) => handleFormCheckAuto(state)}
			/>
			{!widthAutoEnabled && (
				<UnitControl
					label={__('Width', 'iconvert-email-marketer')}
					labelPosition="edge"
					value={width || ''}
					onChange={onWidthChange}
				/>
			)}
		</KubioPanelBody>
	);

	const styleTab = (
		<KubioPanelBody initialOpen={true}>
			<DataProvider.Provider
				value={{ blockJson, attributes, setAttributes }}
			>
				<TextAlignBlockControl />
				<TypographyControl />
				<Background />
				<BorderControl isRadius={true} />
				<SpacingControl />
				<SpacingBlockControl />
			</DataProvider.Provider>
		</KubioPanelBody>
	);

	return (
		<Fragment>
			<InspectorControls>
				<Tab
					tabs={[
						{
							name: 'properties',
							title: 'Properties',
							component: propertiesTab,
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
				style={{ width: '100%' }}
				border="0"
				cellPadding="0"
				cellSpacing="0"
				role="presentation"
				width="100%"
			>
				<tbody>
					<tr>
						<td
							valign="top"
							align={_styleBlock.textAlign}
							style={{
								...styleParser(
									_.pick(_styleBlock, [
										'borderRadius',
										'background',
										'padding',
									])
								),
							}}
						>
							<table style={{ display: 'inline-block' }}>
								<tbody>
									<tr>
										<td
											style={{
												...styleParser(
													_.omit(_style, [
														'padding',
														'border',
													])
												),
												padding: '0px',
											}}
										>
											<div align="center">
												<a
													href={link}
													target="_blank"
													style={{
														display: 'inline-block',
														...styleParser({
															typography:
																_style.typography,
															padding:
																_style.padding,
															background:
																_style.background,
															border: _style.border,
															borderRadius:
																_style.borderRadius,
														}),
													}}
													onClick={(e) => {
														e.preventDefault();
													}}
													rel="noreferrer"
												>
													<RichText
														style={{
															display:
																'inline-block',
															wordBreak:
																'break-word',
															...styleParser({
																typography:
																	_style.typography,
															}),
														}}
														tagName={'span'}
														value={content}
														aria-label={__(
															'Heading text',
															'iconvert-email-marketer'
														)}
														allowedFormats={[
															'core/bold',
															'core/italic',
														]}
														onChange={(content) =>
															setAttributes({
																content,
															})
														}
														placeholder={__(
															'Button…',
															'iconvert-email-marketer'
														)}
													/>
												</a>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</Fragment>
	);
}
