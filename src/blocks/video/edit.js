import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import axios from 'axios';
import {
	GutentagSelectControl,
	KubioPanelBody,
	URLInput,
	ToggleGroup,
} from '@kubio/controls';
import { BorderControl } from '@iconvertem/components/common/panel/border';
import { ImageControl } from '@iconvertem/components/common/panel/imageControl.js';
import { SpacingControl } from '@iconvertem/components/common/panel/spacing';
import { capitalizeFirstLetterWord } from '@iconvertem/components/common/utility/functions.js';
import styleParser from '@iconvertem/components/common/utility/styleParser';
import {
	validateVimeoURL,
	validateYouTubeUrl,
} from '@iconvertem/components/common/utility/urlValidation';
import { renderToString, Fragment } from '@wordpress/element';
import { msoPlayTypeFactory, playTypeFactory } from './playTypeFactory';
import { playTypes, playColors, playSizes } from './constants';

import { DataProvider } from '../blocks';
import blockJson from './block.json';
import { Tab } from '../../components/tab';

const playTypesOptions = Object.keys(playTypes).map((key) => ({
	label: capitalizeFirstLetterWord(playTypes[key].replace('-', ' ')),
	value: playTypes[key],
}));
const playSizesOptions = Object.keys(playSizes).map((key) => ({
	label: capitalizeFirstLetterWord(playSizes[key].replace('-', ' ')),
	value: playSizes[key],
}));
const playColorsOptions = Object.keys(playColors).map((key) => ({
	label: capitalizeFirstLetterWord(playColors[key].replace('-', ' ')),
	value: playColors[key],
}));

export default function Video({ attributes, setAttributes }) {
	const {
		imageWidth,
		imageHeight,
		playType,
		playSize,
		playColor,
		videoUrl,
		imageUrl,
		localImage,
		_style,
	} = attributes;
	const blockProps = useBlockProps({ className: 'video_block' });
	const cellRef = useRef(null);
	const handleVideoUrl = (value) => {
		const validateUrlYoutube = validateYouTubeUrl(value);
		const validateUrlVimeo = validateVimeoURL(value);
		if (validateUrlYoutube) {
			setImageByUrlYoutube(value);
		}
		if (validateUrlVimeo) {
			setImageByUrlVimeo(value);
		}

		setAttributes({ videoUrl: value });
	};

	const setImageByUrlYoutube = (youtubeUrl) => {
		const youtube_video_id = youtubeUrl
			.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/)
			.pop();
		const imgUrl =
			'https://img.youtube.com/vi/' +
			youtube_video_id +
			'/maxresdefault.jpg';

		setImageUrl(imgUrl);
	};

	const setImageUrl = (imgUrl) => {
		const img = new Image();
		img.src = imgUrl;
		img.onload = () => {
			const imgRatio = parseFloat((img.height / img.width).toFixed(2));
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
				setAttributes({ imageWidth: widthCell });
				setAttributes({
					imageHeight: _.ceil(widthCell * imgRatio),
				});
			}
		};

		setAttributes({ imageUrl: imgUrl });
	};

	const setImageByUrlVimeo = (vimeoUrl) => {
		const regExp =
			/^(http:\/\/|https:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)(.+)$/;
		const match = vimeoUrl.match(regExp);
		const vimeoVideoID = match[4];
		const config = {
			mode: 'no-cors',
		};
		axios
			.get(
				'https://www.vimeo.com/api/v2/video/' + vimeoVideoID + '.json',
				config
			)
			.then((res) => {
				setImageUrl(res.data[0].thumbnail_large);
			});
	};

	const wrapperClassVideoPreview = renderToString(
		<a
			className="video-preview"
			target="_blank"
			style={{
				boxSizing: 'content-box',
				width: imageWidth + 'px',
				display: 'block',
				backgroundColor: '#5b5f66',
				backgroundImage:
					'radial-gradient(circle at center, #5b5f66, #1d1f21)',
				margin: 0,
				textDecoration: 'none',
			}}
		>
			<div style={{ boxSizing: 'content-box' }}>
				<table
					cellPadding="0"
					cellSpacing="0"
					border="0"
					width="100%"
					background={'url("' + imageUrl + '")'}
					role="presentation"
					style={{
						msoTableLspace: '0pt',
						msoTableRspace: '0pt',
						boxSizing: 'content-box',

						backgroundImage: 'url("' + imageUrl + '")',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						height: imageHeight + 'px',
						width: imageWidth + 'px',
					}}
				>
					<tbody>
						<tr style={{ boxSizing: 'content-box' }}>
							<td
								width="25%"
								style={{ boxSizing: 'content-box' }}
							>
								<img
									src={
										top.iconvertemRichText.image_video_ratio
									}
									alt="ratio"
									width="100%"
									border="0"
									style={{
										display: 'block',
										boxSizing: 'content-box',
										height: 'auto',
										opacity: 0,
										visibility: 'hidden',
									}}
								/>
							</td>
							<td
								width="50%"
								align="center"
								valign="middle"
								style={{
									boxSizing: 'content-box',
									verticalAlign: 'middle',
								}}
							>
								{playTypeFactory(playType, playColor, playSize)}
							</td>
							<td
								width="25%"
								style={{ boxSizing: 'content-box' }}
							>
								&nbsp;
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</a>
	);

	const wrapperClassSizer = msoPlayTypeFactory(
		playType,
		playColor,
		playSize,
		imageWidth,
		imageHeight,
		videoUrl,
		imageUrl,
		wrapperClassVideoPreview
	);

	const propertiesTab = (
		<KubioPanelBody initialOpen={true}>
			<URLInput
				label={__('Video URL', 'iconvert-email-marketer')}
				value={videoUrl}
				onChange={(value) => handleVideoUrl(value)}
			/>
			<ImageControl
				label={__('Image link', 'iconvert-email-marketer')}
				url={imageUrl}
				setUrl={(value) => setImageUrl(value)}
				onReset={() => setAttributes({ imageUrl: '' })}
				typeImage={localImage}
				setTypeImage={(val) => setAttributes({ localImage: val })}
			/>
			<GutentagSelectControl
				label={__('Play Type', 'iconvert-email-marketer')}
				options={playTypesOptions.map((item) => ({
					...item,
					name: item.label,
					title: item.label,
				}))}
				value={playType}
				onChange={(value) => setAttributes({ playType: value })}
			/>
			<ToggleGroup
				label={__('Play Size', 'iconvert-email-marketer')}
				options={playSizesOptions.map((item) => ({
					...item,
					name: item.label,
					title: item.label,
				}))}
				value={playSize}
				onChange={(value) => setAttributes({ playSize: value })}
			/>
			<ToggleGroup
				label={__('Play Color', 'iconvert-email-marketer')}
				options={playColorsOptions.map((item) => ({
					...item,
					name: item.label,
					title: item.label,
				}))}
				value={playColor}
				onChange={(value) => setAttributes({ playColor: value })}
			/>
		</KubioPanelBody>
	);

	const styleTab = (
		<KubioPanelBody initialOpen={true}>
			<DataProvider.Provider
				value={{ blockJson, attributes, setAttributes }}
			>
				<BorderControl isRadius={false} />
				<SpacingControl />
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
					<tr style={{ boxSizing: 'content-box' }}>
						<td
							ref={cellRef}
							width="100%"
							style={{
								boxSizing: 'content-box',
								width: '100%',
								...styleParser(_style),
							}}
							dangerouslySetInnerHTML={{
								__html: `
<!--[if (mso)|(IE)]><table width="${imageWidth}" align="center" cellPadding="0" cellSpacing="0" role="presentation"><tr><td><![endif]-->
${
	wrapperClassSizer &&
	wrapperClassSizer.props &&
	wrapperClassSizer.props.dangerouslySetInnerHTML &&
	wrapperClassSizer.props.dangerouslySetInnerHTML.__html
}
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
									`,
							}}
						></td>
					</tr>
				</tbody>
			</table>
		</Fragment>
	);
}
