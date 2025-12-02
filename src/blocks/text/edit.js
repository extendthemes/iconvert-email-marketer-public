import { Fragment } from '@wordpress/element';
import { TextAlignControl } from '@iconvertem/components/common/panel/textAlign';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { SpacingControl } from '@iconvertem/components/common/panel/spacing';
import { TypographyControl } from '@iconvertem/components/common/panel/typografy';
import styleParser from '@iconvertem/components/common/utility/styleParser';
import { KubioPanelBody } from '@kubio/controls';
import { allowedFormatsToolbar } from './config';

import { DataProvider } from '../blocks';
import blockJson from './block.json';
import { BorderControl } from '../../components/common/panel/border';

export default function Title({ attributes, setAttributes }) {
	const { content, _style, _styleBlock } = attributes;
	const blockProps = useBlockProps({ className: 'text_block' });

	const onChange = (content) => {
		setAttributes({ content });
	};

	return (
		<Fragment>
			<InspectorControls>
				<KubioPanelBody initialOpen={true}>
					<DataProvider.Provider
						value={{ blockJson, attributes, setAttributes }}
					>
						<TypographyControl />
						<SpacingControl />
						<TextAlignControl />
						<BorderControl
							labelBorder={__(
								'Border',
								'iconvert-email-marketer'
							)}
						/>
					</DataProvider.Provider>
				</KubioPanelBody>
			</InspectorControls>
			<table
				{...blockProps}
				style={{
					msoTableLspace: '0pt',
					msoTableRspace: '0pt',
					wordBreak: 'break-word',
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
							<div style={{ fontFamily: 'sans-serif' }}>
								<RichText
									style={{
										margin: 0,
										...styleParser(_style),
									}}
									tagName={'p'}
									value={content}
									aria-label={__(
										'Heading text',
										'iconvert-email-marketer'
									)}
									allowedFormats={allowedFormatsToolbar}
									onChange={onChange}
									placeholder={__(
										'Title…',
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
