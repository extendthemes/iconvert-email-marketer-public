import { MediaUpload } from "@wordpress/media-utils";

export function MediaUploadCheck( { fallback = null, children } ) {
	const hasUploadPermissions = MediaUpload;
	return hasUploadPermissions ? children : fallback;
}

/**
 * @see https://github.com/WordPress/gutenberg/blob/HEAD/packages/block-editor/src/components/media-upload/README.md
 */
export default MediaUploadCheck;
