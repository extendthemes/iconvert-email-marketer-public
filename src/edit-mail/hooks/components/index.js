/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { MediaUpload } from '@wordpress/media-utils';

const replaceMediaUpload = () => MediaUpload;

addFilter(
	'editor.MediaUpload',
	'ic/edit-mail/replace-media-upload',
	replaceMediaUpload
);
