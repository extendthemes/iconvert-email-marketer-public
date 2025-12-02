import { Dropdown } from '@wordpress/components';
import _ from 'lodash';
import {
	useRef,
	useEffect,
	useState,
	useImperativeHandle,
	forwardRef,
} from '@wordpress/element';
import classnames from 'classnames';

const preventDefault = (e) => {
	e.stopPropagation();
	e.preventDefault();
};

const DropdownWithHover = forwardRef(
	(
		{
			toggleElement,
			children,
			onToggle = _.noop,
			className,
			popoverProps = {},
		} = {},
		ref
	) => {
		const dropdownFunctionsRef = useRef();
		const closePopupTimeoutRef = useRef();
		const baseClass = 'kubio-dropdown-with-hover';

		//cleanup close popup timeout
		useEffect(() => {
			return () => {
				clearTimeout(closePopupTimeoutRef.current);
			};
		}, []);

		const onMouseOver = ({ isOpen, onToggle } = {}) => {
			clearTimeout(closePopupTimeoutRef.current);
			if (!isOpen) {
				onToggle();
			}
		};

		const onClosePopup = () => {
			const onClose = _.get(
				dropdownFunctionsRef,
				['current', 'onClose'],
				_.noop
			);
			onClose();
		};

		useImperativeHandle(ref, () => ({
			onClose: onClosePopup,
		}));

		const onMouseOut = (e) => {
			// preventDefault(e);
			clearTimeout(closePopupTimeoutRef.current);
			closePopupTimeoutRef.current = setTimeout(() => {
				onClosePopup();
			}, 200);
		};
		const mergedPopoverProps = _.merge(
			{},
			{
				position: 'bottom left',
				className: `${baseClass}__popover`,
			},
			popoverProps
		);
		return (
			<div className={classnames(baseClass, className)}>
				<Dropdown
					focusOnMount={false}
					popoverProps={mergedPopoverProps}
					onToggle={onToggle}
					renderToggle={(props) => {
						return (
							<div
								className={`${baseClass}__toggle`}
								onMouseEnter={(e) => {
									preventDefault(e);
									onMouseOver(props);
								}}
								onMouseLeave={onMouseOut}
							>
								{toggleElement}
							</div>
						);
					}}
					renderContent={(props) => {
						dropdownFunctionsRef.current = props;
						return (
							<div
								className={`${baseClass}__content`}
								onMouseEnter={(e) => {
									preventDefault(e);
									onMouseOver(props);
								}}
								onMouseLeave={onMouseOut}
							>
								{children}
							</div>
						);
					}}
				/>
			</div>
		);
	}
);

export { DropdownWithHover };
