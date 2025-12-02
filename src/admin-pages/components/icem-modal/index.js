import { Modal } from '@wordpress/components';
import { IcemSectionTitle } from '@iconvertem/admin-pages/components/icem-section-title';
import classnames from 'classnames';
import { Icon, close } from '@wordpress/icons';

const IcemModal = ({
	onRequestClose,
	title,
	description,
	children,
	footerComponent,
	className,
}) => {
	const xButton = (
		<Icon
			icon={close}
			onClick={onRequestClose}
			className="icem-modal__close-icon"
		/>
	);
	return (
		<Modal
			className={classnames('icem-modal', className)}
			isDismissible={false}
			shouldCloseOnEsc={false}
			shouldCloseOnClickOutside={false}
			onRequestClose={onRequestClose}
		>
			<div className="icem-modal__container">
				<div className="icem-modal__header">
					<IcemSectionTitle
						title={title}
						description={description}
						actionComponent={xButton}
					/>
				</div>

				<div className="icem-modal__content">{children}</div>

				{footerComponent && (
					<div className="icem-modal__footer">{footerComponent}</div>
				)}
			</div>
		</Modal>
	);
};

export { IcemModal };
