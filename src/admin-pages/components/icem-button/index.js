import { Button } from '@wordpress/components';
import classnames from 'classnames';

const IcemButton = ({ children, className, ...props }) => {
	return (
		<Button
			isPrimary
			{...props}
			className={classnames('icem-button ', className)}
		>
			{children}
		</Button>
	);
};

export { IcemButton };
