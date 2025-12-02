import {
	BorderControl as BorderControlBase,
	GutentagSelectControl,
	KubioPanelBody,
	RangeWithUnitControl,
} from '@kubio/controls';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SpacingBlockControl } from '@iconvertem/components/common/panel/spacingBlock';
import { TextAlignBlockControl } from '@iconvertem/components/common/panel/textAlignBlock';
import styleParser from '@iconvertem/components/common/utility/styleParser';
import _ from 'lodash';

import { DataProvider } from '../blocks';
import blockJson from './block.json';

export default function Divider( { attributes, setAttributes } ) {
	const { _style, _styleBlock } = attributes;
	const { width, border } = _style;
	const blockProps = useBlockProps( { className: 'divider' } );

	const onWidthChange = ( nextValue ) => {
		const payload = _.merge( {}, _style, { width: nextValue } );
		setAttributes( { _style: payload } );
	};
	const setBorder = ( value ) => {
		const payload = _.merge( {}, _style, { border: value } );
		setAttributes( { _style: payload } );
	};

	return (
		<Fragment>
			<InspectorControls>
				<KubioPanelBody initialOpen={ true }>
					<DataProvider.Provider
						value={ { blockJson, attributes, setAttributes } }
					>
						<BorderControlBase
							label={ 'Type / Thickness / Color' }
							withColor={ true }
							showLabel={ true }
							showIcon={ false }
							showLinkButton={ false }
							side={ [ 'top' ] }
							filters={ { sides: [ 'top' ] } }
							value={ border }
							onChange={ setBorder }
						/>
						<RangeWithUnitControl
							label={ 'Width' }
							value={ width }
							units={ [
								{
									value: 'px',
									label: 'px',
									default: 0,
									a11yLabel: __(
										'pixels',
										'iconvert-email-marketer'
									),
								},
								{
									value: '%',
									label: '%',
									default: 0,
									a11yLabel: __(
										'percent',
										'iconvert-email-marketer'
									),
								},
							] }
							capMin
							min={ 0 }
							capMax
							max={ width.unit === '%' ? 100 : 600 }
							onChange={ onWidthChange }
						/>
						<TextAlignBlockControl />
						<SpacingBlockControl />
					</DataProvider.Provider>
				</KubioPanelBody>
			</InspectorControls>
			<table
				{ ...blockProps }
				border="0"
				cellPadding="0"
				cellSpacing="0"
				width={ '100%' }
				role="presentation"
			>
				<tbody>
					<tr>
						<td
							style={ { ...styleParser( _styleBlock ) } }
							valign="top"
						>
							<div align={ _styleBlock.textAlign }>
								<table
									border="0"
									cellPadding="0"
									cellSpacing="0"
									role="presentation"
									width={ `${ width.value }${ width.unit }` }
									style={ {
										msoTableLspace: '0pt',
										msoTableRspace: '0pt',
									} }
								>
									<tbody>
										<tr>
											<td
												style={ {
													lineHeight: '1px',
													fontSize: '1px',
													borderTop: `${ border.top.width.value }${ border.top.width.unit } ${ border.top.style } ${ border.top.color }`,
												} }
											>
												<span>&nbsp;</span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</Fragment>
	);
}
