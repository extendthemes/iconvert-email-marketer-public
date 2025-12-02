import { differenceBy } from 'lodash';

import { types } from './types';

import { __ } from '@wordpress/i18n';

import {
	HorizontalAlignCenter,
	HorizontalAlignLeft,
	HorizontalAlignRight,
	VerticalAlignBottom,
	VerticalAlignMiddle,
	VerticalAlignTop,
	TextAlignCenter,
	TextAlignJustify,
	TextAlignLeft,
	TextAlignRight,
} from '@kubio/icons';

const HorizontalAlignValues = {
	LEFT: 'start',
	CENTER: 'center',
	RIGHT: 'end',
};

const HorizontalTextAlignValues = {
	LEFT: 'left',
	CENTER: 'center',
	JUSTIFY: 'justify',
	RIGHT: 'right',
};

const GapValues = types.enums.gapValues;
const VerticalAlignValues = types.enums.verticalAlignValues;

const itemsPerRowOptions = [
	{ value: 1, label: '1' },
	{ value: 2, label: '2' },
	{ value: 3, label: '3' },
	{ value: 4, label: '4' },
	{ value: 6, label: '6' },
];

const verticalAlignOptions = [
	{
		value: VerticalAlignValues.TOP,
		label: __('Top', 'iconvert-email-marketer'),
		icon: VerticalAlignTop,
	},
	{
		value: VerticalAlignValues.MIDDLE,
		label: __('Middle', 'iconvert-email-marketer'),
		icon: VerticalAlignMiddle,
	},
	{
		value: VerticalAlignValues.BOTTOM,
		label: __('Bottom', 'iconvert-email-marketer'),
		icon: VerticalAlignBottom,
	},
];

const horizontalAlignOptions = [
	{
		value: HorizontalAlignValues.LEFT,
		label: __('Left', 'iconvert-email-marketer'),
		icon: HorizontalAlignLeft,
	},
	{
		value: HorizontalAlignValues.CENTER,
		label: __('Center', 'iconvert-email-marketer'),
		icon: HorizontalAlignCenter,
	},
	{
		value: HorizontalAlignValues.RIGHT,
		label: __('Right', 'iconvert-email-marketer'),
		icon: HorizontalAlignRight,
	},
];

const horizontalTextAlignOptions = [
	{
		value: HorizontalTextAlignValues.LEFT,
		label: __('Left', 'iconvert-email-marketer'),
		icon: TextAlignLeft,
	},
	{
		value: HorizontalTextAlignValues.CENTER,
		label: __('Center', 'iconvert-email-marketer'),
		icon: TextAlignCenter,
	},
	{
		value: HorizontalTextAlignValues.RIGHT,
		label: __('Right', 'iconvert-email-marketer'),
		icon: TextAlignRight,
	},
	{
		value: HorizontalTextAlignValues.JUSTIFY,
		label: __('Justify', 'iconvert-email-marketer'),
		icon: TextAlignJustify,
	},
];
const horizontalTextAlignOptionsSimple = differenceBy(
	horizontalTextAlignOptions,
	[{ value: HorizontalTextAlignValues.JUSTIFY }],
	'value'
);

const columnGapTypesOptions = [
	{ value: GapValues.NONE, label: __('No gap', 'iconvert-email-marketer') },
	{ value: GapValues.SMALL, label: 'S' },
	{ value: GapValues.MEDIUM, label: 'M' },
	{ value: GapValues.LARGE, label: 'L' },
	// not implemented
	// { value: GapValues.CUSTOM, label: 'Custom' },
];

const columnInnerGapTypesOptions = [
	...columnGapTypesOptions,
	{ value: 'inherit', label: __('Inherit', 'iconvert-email-marketer') },
];

export {
	verticalAlignOptions,
	horizontalAlignOptions,
	horizontalTextAlignOptions,
	horizontalTextAlignOptionsSimple,
	columnGapTypesOptions,
	columnInnerGapTypesOptions,
	itemsPerRowOptions,
};
