import { __ } from '@wordpress/i18n';
import { Background } from './background';

export const BackgroundBlock = ( {
	labelBackground = __( 'Background row', 'iconvert-email-marketer' ),
	supportsImage = false,
} ) => {
	return (
		<Background
			supportsImage={ supportsImage }
			labelBackground={ labelBackground }
			_element="Block"
		/>
	);
};
