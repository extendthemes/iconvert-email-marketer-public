import {
	ColorIndicatorPopover,
	TypographyControlPopup,
	RangeWithUnitControl,
} from '@kubio/controls';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockData } from '../../../core';

export const CountdownTypography = ( {
	hideTextColor = false,
	hideTypography = false,
	labelTypography = __( 'Typography', 'iconvert-email-marketer' ),
} ) => {
	const getData = useBlockData();

	return (
		<Fragment>
			{ ! hideTextColor && (
				<ColorIndicatorPopover
					label="Text color"
					{ ...getData( 'typography.color' ) }
					// value={color}
					// onChange={setColor}
				/>
			) }

			<RangeWithUnitControl
				{ ...getData( 'typography.size' ) }
				min={ 10 }
				max={ 50 }
				label={ __( 'Font size', 'iconvert-email-marketer' ) }
			/>
		</Fragment>
	);
};
