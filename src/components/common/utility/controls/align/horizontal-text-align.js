import { horizontalTextAlignOptions } from '../ui-utils';
import { HorizontalAlignBase } from './horizontal-align-base';

import {
	HorizontalAlignCenter,
	HorizontalAlignLeft,
	HorizontalAlignRight,
	TextAlignJustify,
} from '@kubio/icons';
import { useMemo } from '@wordpress/element';

const HorizontalTextAlignValues = {
	LEFT: 'start',
	CENTER: 'center',
	RIGHT: 'end',
	JUSTIFY: 'justify',
};
const textAlignWithHorizontalAlignIcons = horizontalTextAlignOptions.map(
	( alignOption ) => {
		let icon = alignOption.icon;
		switch ( alignOption.value ) {
			case HorizontalTextAlignValues.LEFT:
				icon = HorizontalAlignLeft;
				break;
			case HorizontalTextAlignValues.CENTER:
				icon = HorizontalAlignCenter;
				break;
			case HorizontalTextAlignValues.RIGHT:
				icon = HorizontalAlignRight;
				break;
			case HorizontalTextAlignValues.JUSTIFY:
				icon = TextAlignJustify;
				break;
		}
		return {
			...alignOption,
			icon,
		};
	}
);

const HorizontalTextAlign = ( props = {} ) => {
	const { useContentAlignIcons = true, skipJustify = false, ...rest } = props;

	const options = useMemo( () => {
		let nextOptions;
		if ( useContentAlignIcons ) {
			nextOptions = textAlignWithHorizontalAlignIcons;
		} else {
			nextOptions = horizontalTextAlignOptions;
			if ( skipJustify ) {
				nextOptions = nextOptions.slice( 0, 3 );
			}
		}

		return nextOptions;
	}, [ useContentAlignIcons ] );

	return <HorizontalAlignBase options={ options } { ...rest } />;
};

export { HorizontalTextAlign };
