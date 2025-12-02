import { Fragment} from '@wordpress/element';
import { BoxUnitValueControl } from '@kubio/controls';
import { __ } from "@wordpress/i18n";
import { useBlockData } from "../../../core";

export const SpacingBlockControl = ( { labelSpacing=__('Spacing','kubio')  } ) => {
	const getData = useBlockData();

	return (
		<Fragment>
			<BoxUnitValueControl
				label={labelSpacing}
				isRadius={false}
				{...getData('padding',true)}
				units={[
					{
						label: 'PX',
						value: 'px',
					}
				]}
			/>
		</Fragment>
	);
};
