import {
	IcemCopyIcon,
	IcemEditIcon,
	IcemEyeIcon,
	IcemSendIcon,
	IcemSettingsIcon,
	IcemTrashIcon,
} from '@iconvertem/admin-pages/icons';
import { __ } from '@wordpress/i18n';
import { Tooltip } from '@wordpress/components';

const ActionsComponent = ({
	item,
	onEditTemplate,
	onShowEditSettingsModal,
	onViewTemplate,
	onSendTestEmail,
	onShowDeleteModal,
	onViewHtmlCode,
}) => {
	return (
		<>
			<div className="icem-template-list-table__actions">
				<Tooltip text={__('Edit Design', 'iconvert-email-marketer')}>
					<IcemEditIcon onClick={() => onEditTemplate(item.id)} />
				</Tooltip>
				<Tooltip text={__('Edit Settings', 'iconvert-email-marketer')}>
					<IcemSettingsIcon
						onClick={() => onShowEditSettingsModal(item)}
					/>
				</Tooltip>
				<Tooltip text={__('View Template', 'iconvert-email-marketer')}>
					<IcemEyeIcon
						onClick={() => {
							onViewTemplate(item);
						}}
					/>
				</Tooltip>
				<Tooltip text={__('Html code', 'iconvert-email-marketer')}>
					<IcemCopyIcon
						onClick={() => {
							onViewHtmlCode(item);
						}}
					/>
				</Tooltip>
				<Tooltip
					text={__('Send Test Email', 'iconvert-email-marketer')}
				>
					<IcemSendIcon
						onClick={() => onSendTestEmail(item)}
						className="icem-template-list-table__send-icon"
					/>
				</Tooltip>

				<Tooltip text={__('Delete', 'iconvert-email-marketer')}>
					<IcemTrashIcon
						onClick={() => onShowDeleteModal(item)}
						className="icem-template-list-table__delete-icon"
					/>
				</Tooltip>
			</div>
		</>
	);
};

export { ActionsComponent };
