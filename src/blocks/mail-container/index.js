/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
import { columns } from '@wordpress/icons';
import metadata from './block.json';
import edit from './edit';
import save from './save';

import variations from './variations';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: columns,
	variations,
	edit,
	save,
	supports: {
		multiple: false,
	},
};
