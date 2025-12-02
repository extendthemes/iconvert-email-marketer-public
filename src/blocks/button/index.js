/**
 * Internal dependencies
 */
import { button as ButtonIcon } from '@wordpress/icons';
import metadata from './block.json';
import edit from './edit';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: ButtonIcon,
	edit,
};
