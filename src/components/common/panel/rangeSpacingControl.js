import { BoxUnitValueControl, RangeWithUnitControl } from '@kubio/controls';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockData } from '../../../core';

export const RangeSpacingControl = ( {
	label = __( 'Padding', 'iconvert-email-marketer' ),
	sidesSyncControl = [ 'left', 'right', 'top', 'bottom' ],
} ) => {
	const getData = useBlockData();
	const { value, onChange } = getData( 'padding' );
	const rangeValue = value[ sidesSyncControl[ 0 ] ];
	const rangeOnChange = ( nextValue ) => {
		const payload = Object.assign( {}, value );
		sidesSyncControl.forEach( ( side ) => {
			payload[ side ] = nextValue;
		} );
		onChange( payload );
	};
	return (
		<Fragment>
			<RangeWithUnitControl
				label={ label }
				value={ rangeValue }
				onChange={ ( nextVal ) => rangeOnChange( nextVal ) }
				units={ [
					{
						value: 'px',
						label: 'px',
						default: 0,
						a11yLabel: __( 'pixels', 'iconvert-email-marketer' ),
					},
				] }
				capMin
				capMax
				min={ 0 }
				max={ 50 }
			/>
		</Fragment>
	);
};
