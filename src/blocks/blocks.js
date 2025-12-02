/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */

import { registerBlockType as wpRegisterBlockType } from '@wordpress/blocks';
import { createContext } from '@wordpress/element';
import {
	metadata as metadataMailContainer,
	name as nameMailContainer,
	settings as settingMailContainer,
} from './mail-container/index.js';
import {
	metadata as metadataCell,
	name as nameCell,
	settings as settingCell,
} from './block-cell/index.js';
import {
	metadata as metadataRow,
	name as nameRow,
	settings as settingRow,
} from './block-row/index.js';
import {
	metadata as metadataButton,
	name as nameButton,
	settings as settingButton,
} from './button/index.js';
import {
	metadata as metadataDivider,
	name as nameDivider,
	settings as settingDivider,
} from './divider/index.js';
import {
	metadata as metadataTitle,
	name as nameTitle,
	settings as settingTitle,
} from './heading/index.js';
import {
	metadata as metadataHtml,
	name as nameHtml,
	settings as settingHtml,
} from './html/index.js';
import {
	metadata as metadataImg,
	name as nameImg,
	settings as settingImg,
} from './image/index.js';
import {
	metadata as metadataLink,
	name as nameLink,
	settings as settingLink,
} from './link/index.js';
import {
	metadata as metadataSocialIcons,
	name as nameSocialIcons,
	settings as settingSocialIcons,
} from './social-icons/index.js';
import {
	metadata as metadataText,
	name as nameText,
	settings as settingText,
} from './text/index.js';
import {
	metadata as metadataVideo,
	name as nameVideo,
	settings as settingVideo,
} from './video/index.js';

import { dispatch, select } from '@wordpress/data';

const categories = select('core/blocks').getCategories();

dispatch('core/blocks').setCategories([
	...categories,
	{
		slug: 'iconvertem-mail-elements',
		title: 'Elements',
	},
]);

const registerBlockType = (metadata, settings) => {
	wpRegisterBlockType(
		{
			...metadata,
			supports: {
				anchor: false,
				html: false,
				customClassName: false,
				className: false,
				...(metadata?.supports || {}),
			},
		},
		{
			...settings,
			supports: {
				anchor: false,
				html: false,
				customClassName: false,
				className: false,
				...(metadata?.supports || {}),
				...(settings?.supports || {}),
			},
		}
	);
};

export const DataProvider = createContext({});
registerBlockType(
	{ nameMailContainer, ...metadataMailContainer },
	settingMailContainer
);
registerBlockType({ nameRow, ...metadataRow }, settingRow);
registerBlockType({ nameCell, ...metadataCell }, settingCell);
registerBlockType({ nameTitle, ...metadataTitle }, settingTitle);
registerBlockType({ nameText, ...metadataText }, settingText);
registerBlockType({ nameImg, ...metadataImg }, settingImg);
registerBlockType({ nameButton, ...metadataButton }, settingButton);
registerBlockType({ nameLink, ...metadataLink }, settingLink);
registerBlockType({ nameDivider, ...metadataDivider }, settingDivider);
registerBlockType(
	{ nameSocialIcons, ...metadataSocialIcons },
	settingSocialIcons
);
registerBlockType({ nameVideo, ...metadataVideo }, settingVideo);
registerBlockType({ nameHtml, ...metadataHtml }, settingHtml);

