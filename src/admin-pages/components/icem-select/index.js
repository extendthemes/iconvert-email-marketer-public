import { BaseControl, SelectControl } from '@wordpress/components';
import classnames from 'classnames';

const IcemSelect = ({
	value,
	onChange,
	label,
	options,
	wrapperProps = {},
	...rest
}) => {
	const inputClassName = rest?.className;
	const wrapperClassName = wrapperProps?.className;
	return (
		<>
			<BaseControl
				{...wrapperProps}
				className={classnames(
					wrapperClassName,
					'icem-select__container'
				)}
			>
				{label && (
					<BaseControl.VisualLabel className="icem-control-label">
						{label}
					</BaseControl.VisualLabel>
				)}
				<SelectControl
					value={value}
					onChange={onChange}
					options={options}
					{...rest}
					className={classnames(
						inputClassName,
						'icem-select__select'
					)}
				/>
			</BaseControl>
		</>
	);
};
export { IcemSelect };
