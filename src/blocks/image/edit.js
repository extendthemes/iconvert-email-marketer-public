import {
	KubioPanelBody,
	RangeWithUnitControl,
	URLInput,
} from '@kubio/controls';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { Fragment, useEffect, useRef, useState } from '@wordpress/element';
import { image as icon } from '@wordpress/icons';
import { BlockIcon } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { BorderControl } from '@iconvertem/components/common/panel/border';
import { ImageControl } from '@iconvertem/components/common/panel/imageControl.js';
import { SpacingControl } from '@iconvertem/components/common/panel/spacing';
import { SpacingBlockControl } from '@iconvertem/components/common/panel/spacingBlock';
import { TextAlignBlockControl } from '@iconvertem/components/common/panel/textAlignBlock';
import styleParser from '@iconvertem/components/common/utility/styleParser';
import { MediaPlaceholder } from '@iconvertem/components/common/custom-components/media-placeholder';

import { DataProvider } from '../blocks';
import blockJson from './block.json';
import { Tab } from '../../components/tab';

export default function Image({ attributes, setAttributes }) {
	const { imageUrl, imageLink, localImage, _style, _styleBlock } = attributes;
	const { width } = _style;
	const { textAlign } = _styleBlock;
	const blockProps = useBlockProps({ className: 'image_block' });
	const cellRef = useRef(null);
	const [maxWidthImg, setMaxWidthImg] = useState(600);
	const setLocalImage = (val) => {
		setAttributes({ imageUrl: val });
		calculateWidthImg();
	};
	const setWidthImage = (value) => {
		const payload = {
			..._style,
			width: value,
		};
		setAttributes({ _style: payload });
	};
	useEffect(() => {
		calculateWidthImg();
	}, []);
	const calculateWidthImg = () => {
		if (cellRef && cellRef.current && cellRef.current.clientWidth) {
			const paddingLeftCell =
				cellRef && cellRef.current && cellRef.current.paddingLeft
					? cellRef.current.paddingLeft
					: 0;
			const paddingRightCell =
				cellRef && cellRef.current && cellRef.current.paddingRight
					? cellRef.current.paddingRight
					: 0;
			const widthCell =
				cellRef.current.clientWidth -
				paddingLeftCell -
				paddingRightCell;
			setMaxWidthImg(widthCell);
			if (maxWidthImg < width) {
				setWidthImage({ ..._style.width, value: widthCell });
			}
		}
	};
	const mediaPreview = (url) => {
		if (!_.isEmpty(url)) {
			return (
				<img
					alt={__('Edit image', 'iconvert-email-marketer')}
					title={__('Edit image', 'iconvert-email-marketer')}
					className={'edit-image-preview'}
					src={url}
				/>
			);
		}
	};
	const renderBlock = () => {
		if (_.isEmpty(imageUrl)) {
			return (
				<MediaPlaceholder
					icon={<BlockIcon icon={icon} />}
					onSelect={(el) => setLocalImage(el.url)}
					onSelectURL={setLocalImage}
					onError={(error) => alert(error)}
					accept="image/*"
					allowedTypes={['image']}
					value={imageUrl}
					mediaPreview={mediaPreview(imageUrl)}
					disableMediaButtons={imageUrl}
					multiple={false}
					labels={{
						title: __('Image', 'iconvert-email-marketer'),
						instructions: __(
							'Upload an image file, pick one from your media library, or add one with a URL.',
							'iconvert-email-marketer'
						),
					}}
				/>
			);
		}
		if (imageLink.length > 0) {
			return (
				<a
					style={{ display: 'inline-block' }}
					onClick={(e) => {
						e.preventDefault();
					}}
				>
					<img
						src={imageUrl}
						alt={imageUrl}
						title={imageUrl}
						width={width.value}
						style={{
							display: 'inline-block',
							maxWidth: '100%',
							height: 'auto',
							...styleParser(_style),
						}}
					/>
				</a>
			);
		}

		return (
			<img
				src={imageUrl}
				alt={imageUrl}
				title={imageUrl}
				width={width.value}
				style={{
					display: 'inline-block',
					maxWidth: '100%',
					height: 'auto',
					...styleParser(_style),
				}}
			/>
		);
	};

	const propertiesTab = (
		<KubioPanelBody initialOpen={true}>
			<ImageControl
				typeImage={localImage}
				setTypeImage={setLocalImage}
				url={imageUrl}
				setUrl={(value) => setAttributes({ imageUrl: value })}
				onReset={() =>
					setAttributes({
						imageUrl: blockJson.attributes.imageUrl.default,
					})
				}
			/>
			<URLInput
				label={__('Target link', 'iconvert-email-marketer')}
				value={imageLink}
				onChange={(value) => setAttributes({ imageLink: value })}
				placeholder={'https://...'}
			/>
		</KubioPanelBody>
	);

	const styleTab = (
		<KubioPanelBody initialOpen={true}>
			<DataProvider.Provider
				value={{ blockJson, attributes, setAttributes }}
			>
				<RangeWithUnitControl
					label={__('Image width', 'iconvert-email-marketer')}
					onChange={setWidthImage}
					value={width}
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
					min={25}
					max={maxWidthImg}
				/>
				<TextAlignBlockControl labelTextAlign={'Align'} />
				<BorderControl />
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
				width="100%"
				border="0"
				cellPadding="0"
				cellSpacing="0"
				role="presentation"
				style={{
					msoTableLspace: '0pt',
					msoTableRspace: '0pt',
					width: '100%',
				}}
			>
				<tbody>
					<tr>
						<td
							ref={cellRef}
							style={{ ...styleParser(_styleBlock) }}
						>
							<div
								align={textAlign}
								style={{ lineHeight: '10px' }}
							>
								{renderBlock()}
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</Fragment>
	);
}
