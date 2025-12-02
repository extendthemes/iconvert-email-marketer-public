/**
 * Internal dependencies
 */
import deprecated from './deprecated';
import edit from './edit';
import metadata from './block.json';
import save from './save';
import { column } from '@wordpress/icons';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: column,
	edit,
	save,
	deprecated,
};
