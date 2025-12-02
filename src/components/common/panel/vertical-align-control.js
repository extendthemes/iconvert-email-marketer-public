import { ToggleGroup } from '@kubio/controls';
import { useBlockData } from "../../../core";
import { verticalAlignOptions } from '../utility/controls/ui-utils';

const VerticalAlignControl = () => {
	const getData = useBlockData();
	return (
		<ToggleGroup
			{...getData('verticalAlign')}
			allowReset
			options={verticalAlignOptions}
		/>
	);
};

export { VerticalAlignControl };
