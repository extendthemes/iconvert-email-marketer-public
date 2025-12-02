import {
	__experimentalInputControl as WordpressInputControl,
	BaseControl,
} from '@wordpress/components';
import classnames from 'classnames';

const IcemInput = ({ value, onChange, label, wrapperProps = {}, ...rest }) => {
	const inputClassName = rest?.className;
	const wrapperClassName = wrapperProps?.className;
	return (
		<>
			<BaseControl
				{...wrapperProps}
				className={classnames(
					wrapperClassName,
					'icem-input__container'
				)}
			>
				{label && (
					<BaseControl.VisualLabel className="icem-control-label">
						{label}
					</BaseControl.VisualLabel>
				)}
				<WordpressInputControl
					value={value}
					onChange={onChange}
					{...rest}
					className={classnames(inputClassName, 'icem-input__input')}
				/>
			</BaseControl>
		</>
	);
};
export { IcemInput };
