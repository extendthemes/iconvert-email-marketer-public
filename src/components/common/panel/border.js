import {
	BorderControl as BorderControlBase,
	BoxUnitValueControl,
} from '@kubio/controls';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockData } from '../../../core';

const RADIUS_UNITS = [
	{
		label: 'PX',
		value: 'px',
	},
	{
		label: '%',
		value: '%',
	},
];

export const BorderControl = ({
	labelBorder,
	isRadius = true,
	labelBorderRadius = __('Radius', 'iconvert-email-marketer'),
	_element = '',
}) => {
	const getData = useBlockData(_element);

	return (
		<Fragment>
			<BorderControlBase
				label={labelBorder}
				withColor={true}
				showLabel={true}
				{...getData('border')}
			/>
			{isRadius && (
				<BoxUnitValueControl
					isRadius={true}
					label={labelBorderRadius}
					units={RADIUS_UNITS}
					{...getData('borderRadius')}
				/>
			)}
		</Fragment>
	);
};
