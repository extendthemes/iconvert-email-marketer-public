import { __ } from '@wordpress/i18n';
import { IcemModal } from '@iconvertem/admin-pages/components/icem-modal';
import { IcemButton } from '@iconvertem/admin-pages/components';

const DeleteModal = ({ onClose, postId, onDelete }) => {
	const footerComponent = (
		<>
			<IcemButton isPrimary variant="secondary" onClick={onClose}>
				{__('Cancel', 'iconvert-email-marketer')}
			</IcemButton>
			<IcemButton
				variant="primary"
				isDestructive
				onClick={() => onDelete(postId)}
			>
				{__('Delete', 'iconvert-email-marketer')}
			</IcemButton>
		</>
	);
	return (
		<IcemModal
			className="icem-delete-modal"
			onRequestClose={onClose}
			title={__('Delete Template?', 'iconvert-email-marketer')}
			footerComponent={footerComponent}
		>
			<h3>
				{__(
					'Are you sure you wan to delete this Template?',
					'iconvert-email-marketer'
				)}
			</h3>
		</IcemModal>
	);
};

export { DeleteModal };
