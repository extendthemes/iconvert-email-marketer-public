import { TextareaControl, BaseControl } from '@wordpress/components';
import classnames from 'classnames';
import { forwardRef } from '@wordpress/element';

const IcemTextarea = forwardRef(
	({ value, onChange, label, wrapperProps = {}, ...rest }, ref) => {
		const inputClassName = rest?.className;
		const wrapperClassName = wrapperProps?.className;
		return (
			<>
				<BaseControl
					{...wrapperProps}
					className={classnames(
						wrapperClassName,
						'icem-textarea__container'
					)}
				>
					{label && (
						<BaseControl.VisualLabel className="icem-control-label">
							{label}
						</BaseControl.VisualLabel>
					)}
					<TextareaControl
						ref={ref}
						value={value}
						onChange={onChange}
						{...rest}
						className={classnames(
							inputClassName,
							'icem-textarea__input'
						)}
					/>
				</BaseControl>
			</>
		);
	}
);
export { IcemTextarea };
