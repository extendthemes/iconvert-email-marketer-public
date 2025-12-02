/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */
import { columns } from '@wordpress/icons';
import metadata from './block.json';
import deprecated from './deprecated';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import variations from './variations';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: columns,
	variations,
	deprecated,
	edit,
	save,
	transforms,
};
