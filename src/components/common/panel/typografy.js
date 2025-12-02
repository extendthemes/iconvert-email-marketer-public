import { ColorIndicatorPopover, TypographyControlPopup } from '@kubio/controls';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useBlockData } from '../../../core';

export const TypographyControl = ({
	hideTextColor = false,
	hideTypography = false,
	_element = '',
	labelTextColor = __('Text color', 'iconvert-email-marketer'),
	labelTypography = __('Typography', 'iconvert-email-marketer'),
}) => {
	const getData = useBlockData(_element);

	return (
		<Fragment>
			{!hideTextColor && (
				<ColorIndicatorPopover
					label={labelTextColor}
					{...getData('typography.color')}
					// value={color}
					// onChange={setColor}
				/>
			)}

			{!hideTypography && (
				<TypographyControlPopup
					label={labelTypography}
					{...getData('typography')}
					// value={typography}
					// onChange={setTypo}
				/>
			)}
		</Fragment>
	);
};
