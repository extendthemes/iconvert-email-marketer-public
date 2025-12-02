import { BoxUnitValueControl } from '@kubio/controls';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockData } from '../../../core';

export const SpacingControl = ( {
	labelSpacing = __( 'Padding', 'iconvert-email-marketer' ),
	_element = '',
	property = 'padding',
} ) => {
	const getData = useBlockData( _element );

	return (
		<Fragment>
			<BoxUnitValueControl
				label={ labelSpacing }
				isRadius={ false }
				{ ...getData( property ) }
				units={ [
					{
						label: 'PX',
						value: 'px',
					},
				] }
			/>
		</Fragment>
	);
};
