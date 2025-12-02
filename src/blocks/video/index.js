/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import {video as VideoIcon} from '@wordpress/icons'

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: VideoIcon,
	edit
};
