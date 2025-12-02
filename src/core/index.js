export * from './hooks';
/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { MediaUpload } from '@wordpress/media-utils';
export * from './register-custom-entities';

addFilter(
	'editor.MediaUpload',
	'core/edit-site/components/media-upload',
	() => MediaUpload
);
