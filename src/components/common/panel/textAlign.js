import { Fragment } from '@wordpress/element';
import { HorizontalTextAlign } from '../utility/controls/align';
import { useBlockData } from '../../../core';
import { __ } from '@wordpress/i18n';

export const TextAlignControl = ( {
	labelTextAlign = __( 'Text align', 'iconvert-email-marketer' ),
	_element = '',
} ) => {
	const getData = useBlockData( _element );

	return (
		<Fragment>
			<HorizontalTextAlign
				label={ labelTextAlign }
				{ ...getData( 'textAlign' ) }
			/>
		</Fragment>
	);
};
