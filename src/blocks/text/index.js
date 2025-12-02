/**
 * Internal dependencies
 */
import { paragraph } from '@wordpress/icons';
import metadata from './block.json';
import edit from './edit';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: paragraph,
	edit,
};
