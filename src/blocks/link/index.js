/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { link as LinkIcon } from '@wordpress/icons';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: LinkIcon,
	edit,
	// save,
};
