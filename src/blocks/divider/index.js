/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { separator } from '@wordpress/icons';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: separator,
	edit,
};
