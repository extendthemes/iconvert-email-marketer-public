import { TextAlignControl } from '@iconvertem/components/common/panel/textAlign';
import { Fragment } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { SpacingControl } from '@iconvertem/components/common/panel/spacing';
import { TypographyControl } from '@iconvertem/components/common/panel/typografy';
import styleParser from '@iconvertem/components/common/utility/styleParser';
import { KubioPanelBody, ToggleGroup } from '@kubio/controls';
import { allowedFormatsToolbar } from './config';
import { DataProvider } from '../blocks';
import blockJson from './block.json';
import { Tab } from '../../components/tab';
import { BorderControl } from '../../components/common/panel/border';

const optionsHeadingTypes = [
	{ label: 'H1', value: '1', size: 38 },
	{ label: 'H2', value: '2', size: 30 },
	{ label: 'H3', value: '3', size: 26 },
	{ label: 'H4', value: '4', size: 20 },
	{ label: 'H5', value: '5', size: 16 },
	{ label: 'H6', value: '6', size: 12 },
];

export default function Title({ attributes, setAttributes }) {
	const { content, level, _style, _styleBlock } = attributes;
	const tagName = 'h' + level;
	const blockProps = useBlockProps({ className: 'text_block' });
	const changeType = (type) => {
		setAttributes({ level: type });
		const optionSelected = optionsHeadingTypes.find(
			(item) => item.value === type
		);
		if (optionSelected) {
			setAttributes({
				_style: {
					..._style,
					typography: {
						..._style.typography,
						size: {
							..._style.typography.size,
							value: optionSelected.size,
						},
					},
				},
			});
		}
	};

	const onChange = (content) => {
		setAttributes({ content });
	};

	const propertiesTab = (
		<KubioPanelBody initialOpen={true}>
			<ToggleGroup
				label={__('Type', 'iconvert-email-marketer')}
				value={level}
				options={optionsHeadingTypes}
				onChange={changeType}
			/>
		</KubioPanelBody>
	);

	const styleTab = (
		<KubioPanelBody initialOpen={true}>
			<DataProvider.Provider
				value={{ blockJson, attributes, setAttributes }}
			>
				<TypographyControl />
				<SpacingControl />
				<TextAlignControl />
				<BorderControl
					labelBorder={__('Border', 'iconvert-email-marketer')}
				/>
				{/*<SpacingBlockControl />*/}
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
				width="100%"
				border="0"
				cellPadding="0"
				cellSpacing="0"
				role="presentation"
				style={{
					msoTableLspace: '0pt',
					msoTableRspace: '0pt',
					wordBreak: 'break-word',
					width: '100%',
				}}
			>
				<tbody>
					<tr>
						<td style={{ ...styleParser(_styleBlock) }}>
							<div style={{ fontFamily: 'sans-serif' }}>
								<RichText
									style={{
										margin: 0,
										...styleParser(_style),
									}}
									tagName={tagName}
									value={content}
									aria-label={__(
										'Heading text',
										'iconvert-email-marketer'
									)}
									allowedFormats={allowedFormatsToolbar}
									onChange={onChange}
									placeholder={__(
										'Heading…',
										'iconvert-email-marketer'
									)}
								/>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</Fragment>
	);
}
