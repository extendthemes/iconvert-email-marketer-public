import { ToggleControl } from '@wordpress/components';
import classnames from 'classnames';

const IcemToggleControl = ({ value, onChange, className, ...props }) => {
	return (
		<ToggleControl
			checked={value}
			onChange={onChange}
			{...props}
			className={classnames('icem-toggle-control', className)}
		/>
	);
};

export { IcemToggleControl };
