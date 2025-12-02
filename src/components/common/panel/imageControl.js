import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MediaPicker, ToggleGroup, URLInput } from '@kubio/controls';

export const ImageControl = ( {
	typeImage,
	setTypeImage,
	url,
	setUrl,
	onReset,
	labelImageSelection = __( 'Image Selection', 'iconvert-email-marketer' ),
	labelMediaPicker = __( 'Change image', 'iconvert-email-marketer' ),
	labelUrlInput = __( 'URL Input', 'iconvert-email-marketer' ),
	...props
} ) => {
	return (
		<Fragment { ...props }>
			{/* <ToggleGroup
				label={ labelImageSelection }
				options={ [
					{
						name: 'Media Library',
						label: 'Media Library',
						value: true,
					},
					{ name: 'Url', label: 'Url', value: false },
				] }
				value={ typeImage }
				onChange={ setTypeImage }
			/> */}
			{ typeImage && (
				<MediaPicker
					value={ url }
					type={ 'image' }
					showButton
					showRemoveButton
					onReset={ onReset }
					buttonLabel={ labelMediaPicker }
					removeButtonLabel={ __( 'Reset image', 'iconvert-email-marketer' ) }
					onChange={ ( image ) => setUrl( image.url ) }
				/>
			) }
			{ ! typeImage && (
				<URLInput
					value={ url }
					onChange={ setUrl }
					label={ labelUrlInput }
					placeholder={ 'https://...' }
					style={ { marginBottom: '15px' } }
				/>
			) }
			<div style={ { display: 'block', marginBottom: '15px' } }></div>
		</Fragment>
	);
};
