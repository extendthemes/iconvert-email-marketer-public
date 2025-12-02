import {
	ColorIndicatorPopover,
	PopoverOptionsButton,
	MediaPicker,
} from '@kubio/controls';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockData } from '../../../core';

export const Background = ( {
	labelBackground = __( 'Background color', 'iconvert-email-marketer' ),
	_element = '',
	supportsImage = false,
} ) => {
	const getData = useBlockData( _element );
	const backgroundColor = getData( 'background' );
	const backgroundImage = getData( 'backgroundImage' );

	const backgroundImageOnChange = ( next ) => {
		backgroundImage.onChange( next.url || '' );
	};

	if ( supportsImage ) {
		return (
			<PopoverOptionsButton
				label={ labelBackground }
				popoverWidth={ 250 }
				popupContent={
					<>
						<ColorIndicatorPopover
							label={ __(
								'Background color',
								'iconvert-email-marketer'
							) }
							{ ...backgroundColor }
							showReset={ true }
						/>
						<MediaPicker
							type={ 'image' }
							buttonLabel={ __(
								'Background image',
								'iconvert-email-marketer'
							) }
							showButton
							showRemoveButton
							removeButtonLabel={ __(
								'Reset image',
								'iconvert-email-marketer'
							) }
							{ ...backgroundImage }
							onChange={ backgroundImageOnChange }
						/>
					</>
				}
			/>
		);
	}

	return (
		<Fragment>
			<ColorIndicatorPopover
				label={ labelBackground }
				{ ...backgroundColor }
				showReset={ true }
			/>
		</Fragment>
	);
};
