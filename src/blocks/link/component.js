import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import styleParser from '@iconvertem/components/common/utility/styleParser.js';

const Component = (props) => {
	const { attributes, setAttributes } = props;
	const { content, link, _style, _styleBlock } = attributes;

	const blockProps = useBlockProps({ className: 'link_block' });

	return (
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
					<td valign="top">
						<div
							align="center"
							style={{ ...styleParser(_styleBlock) }}
						>
							<a
								href={link}
								target="_blank"
								style={{
									display: 'inline-block',
									...styleParser(_style),
								}}
								onClick={(e) => {
									e.preventDefault();
								}}
								rel="noreferrer"
							>
								<RichText
									style={{
										display: 'inline-block',
										wordBreak: 'break-word',
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
										setAttributes({ content })
									}
									placeholder={__(
										'Link…',
										'iconvert-email-marketer'
									)}
								/>
							</a>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export { Component };
