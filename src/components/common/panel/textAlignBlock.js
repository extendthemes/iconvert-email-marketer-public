import { Fragment } from '@wordpress/element';
import { useBlockData } from "../../../core";
import { HorizontalTextAlign } from "../utility/controls/align";
import { __ } from "@wordpress/i18n";

export const TextAlignBlockControl = ( { labelTextAlign = __('Text align','kubio') } ) => {
	const getData = useBlockData();

	return (
		<Fragment>
			<HorizontalTextAlign
				label={ labelTextAlign }
				{...getData('textAlign',true)}
			/>
		</Fragment>
	);
}
