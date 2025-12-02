/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { heading } from '@wordpress/icons';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: heading,
	edit,
};
