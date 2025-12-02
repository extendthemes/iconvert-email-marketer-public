import { RadioControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import classnames from 'classnames';

const RadioGroupWithIcons = ({ value, onChange, options }) => {
	return (
		<div className="icem-radio-group-with-icons">
			{options.map((option, index) => {
				return (
					<RadioItemWithIcon
						key={index}
						activeValue={value}
						onChange={onChange}
						{...option}
					/>
				);
			})}
		</div>
	);
};

const RadioItemWithIcon = ({
	IconComponent = Fragment,
	value,
	label,
	activeValue,
	onChange,
}) => {
	const options = [{ label, value }];
	const isActive = activeValue === value;
	const radioValue = isActive ? value : null;

	const onClick = () => {
		if (isActive) {
			return;
		}
		onChange(value);
	};
	return (
		<div
			className={classnames(
				'icem-radio-item-with-icon',
				{
					'icem-radio-item-with-icon--active': isActive,
				},
				`icem-radio-item-with-icon__${value}`
			)}
			onClick={onClick}
		>
			<div className="icem-radio-item-with-icon__icon__container">
				<IconComponent />
			</div>
			<RadioControl options={options} selected={radioValue} />
		</div>
	);
};
export { RadioGroupWithIcons };
