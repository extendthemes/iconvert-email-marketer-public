import {
	GutentagSelectControl,
	KubioPanelBody,
	ManagedSortableAccordion,
	RangeWithUnitControl,
	SidebarButton,
	ToggleGroup,
	URLInput,
} from '@kubio/controls';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { socialIconsOptions } from '@iconvertem/components/common/constants';
import { RangeSpacingControl } from '@iconvertem/components/common/panel/rangeSpacingControl.js';
import { SpacingBlockControl } from '@iconvertem/components/common/panel/spacingBlock';
import { TextAlignBlockControl } from '@iconvertem/components/common/panel/textAlignBlock';
import styleParser from '@iconvertem/components/common/utility/styleParser';
import _ from 'lodash';
import { BorderControl } from '../../components/common/panel/border';
import { Tab } from '../../components/tab';
import { DataProvider } from '../blocks';
import blockJson from './block.json';

const optionsIconsColor = [
	{ label: 'Color', value: 'color' },
	{ label: 'Black', value: 'black' },
	{ label: 'White', value: 'white' },
];
const SortableAccordionItem = ({ item, updateItem }) => {
	const onChangeType = (value) => {
		updateItem({
			...item,
			type: value,
		});
	};
	const onChangeTitle = (value) => {
		updateItem({
			...item,
			title: value,
		});
	};
	const onChangeLink = (value) => {
		updateItem({
			...item,
			link: value,
		});
	};

	return (
		<Fragment>
			<GutentagSelectControl
				label={__('Icon Type', 'iconvert-email-marketer')}
				options={socialIconsOptions.map((item) => ({
					...item,
					name: item.label,
					title: item.label,
				}))}
				value={item.type}
				onChange={onChangeType}
			/>
			<TextControl value={item.title} onChange={onChangeTitle} />
			<URLInput
				label={__('Icon URL', 'iconvert-email-marketer')}
				value={item.link}
				onChange={onChangeLink}
			/>
		</Fragment>
	);
};
const SortableAccordionIcons = ({ icons, widthSocialIcons, updateIcons }) => {
	const addNewSocialIcon = () => {
		const iconToAdd = _.sample(
			_.differenceBy(socialIconsOptions, icons, 'value')
		);
		updateIcons(
			_.union(icons, [
				{
					...iconToAdd,
					type: iconToAdd.value,
					name: iconToAdd.label,
					title: iconToAdd.label,
				},
			])
		);
	};
	const allowAddAnotherSocialIcon =
		_.multiply(_.divide(widthSocialIcons, icons.length), icons.length + 1) <
		600;
	return (
		<Fragment>
			<ManagedSortableAccordion
				value={icons}
				onChange={updateIcons}
				headingRenderer={(item) => <p>{item.title}</p>}
				onItemDuplicate={(newItem) => ({
					...newItem,
					title: `${newItem.title} dup`,
				})}
				contentRendered={(updateItem, item, index) => (
					<SortableAccordionItem
						updateItem={updateItem}
						item={item}
						index={index}
					/>
				)}
			/>
			{allowAddAnotherSocialIcon && (
				<SidebarButton
					onClick={(e) => {
						addNewSocialIcon();
					}}
					style={{
						width: '100%',
						justifyContent: 'center',
					}}
				>
					{__('Add New', 'iconvert-email-marketer')}
				</SidebarButton>
			)}
		</Fragment>
	);
};
export default function SocialIcon({ attributes, setAttributes }) {
	const { icons, iconsColor, sizeIcons, _style, _styleBlock } = attributes;
	const { padding } = _style;
	const blockProps = useBlockProps({ className: 'social_block' });

	const updateIcons = (value) => {
		setAttributes({ icons: value });
	};
	const handleIconSize = (value) => {
		setAttributes({ sizeIcons: value });
	};
	const widthSocialIcons = _.multiply(
		icons.length,
		_.sum([sizeIcons.value, padding.left.value, padding.right.value])
	);

	const propertiesTab = (
		<KubioPanelBody initialOpen={true}>
			<ToggleGroup
				label={__('Icons type', 'iconvert-email-marketer')}
				value={iconsColor}
				options={optionsIconsColor}
				onChange={(value) => setAttributes({ iconsColor: value })}
			/>
			<SortableAccordionIcons
				icons={icons}
				widthSocialIcons={widthSocialIcons}
				updateIcons={updateIcons}
			/>
			<RangeWithUnitControl
				label={'Icon size'}
				onChange={handleIconSize}
				value={sizeIcons}
				units={[
					{
						value: 'px',
						label: 'px',
						default: 0,
						a11yLabel: __('pixels', 'iconvert-email-marketer'),
					},
				]}
				capMin
				capMax
				min={16}
				max={100}
			/>
		</KubioPanelBody>
	);

	const styleTab = (
		<KubioPanelBody initialOpen={true}>
			<DataProvider.Provider
				value={{ blockJson, attributes, setAttributes }}
			>
				<TextAlignBlockControl />
				<RangeSpacingControl
					label={'Spacing'}
					sidesSyncControl={['left', 'right']}
				/>
				<SpacingBlockControl labelSpacing={'Padding'} />
				<BorderControl
					labelBorder={__('Border', 'iconvert-email-marketer')}
					_element="block"
				/>
			</DataProvider.Provider>
		</KubioPanelBody>
	);

	return (
		<Fragment>
			<InspectorControls>
				<Tab
					tabs={[
						{
							name: 'icons',
							title: 'Icons',
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
				style={{
					msoTableLspace: '0pt',
					msoTableRspace: '0pt',
					width: '100%',
				}}
				width="100%"
				border="0"
				cellPadding="0"
				cellSpacing="0"
				role="presentation"
			>
				<tbody>
					<tr>
						<td style={{ ...styleParser(_styleBlock) }}>
							<table
								className="social-table"
								width={_.concat(
									widthSocialIcons,
									sizeIcons.unit
								).join('')}
								border="0"
								cellPadding="0"
								cellSpacing="0"
								role="presentation"
								style={{
									msoTableLspace: '0pt',
									msoTableRspace: '0pt',
									display: 'inline-block',
								}}
							>
								<tbody>
									<tr>
										{icons.map((item) => {
											return (
												<td
													style={{
														...styleParser(_style),
													}}
													key={item.title.toString()}
												>
													<a
														style={{
															display:
																'inline-block',
														}}
													>
														<img
															src={`${iconvertemRichText.social_icons_base_url}/${iconsColor}/${item.type}.png`}
															alt={`${item.title}_${iconsColor}`}
															title={item.title}
															style={{
																width:
																	sizeIcons.value +
																	sizeIcons.unit,
																height:
																	sizeIcons.value +
																	sizeIcons.unit,
															}}
															width={
																sizeIcons.value
															}
															height={
																sizeIcons.value
															}
														/>
													</a>
												</td>
											);
										})}
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
