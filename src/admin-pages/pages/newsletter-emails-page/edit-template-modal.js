import { __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	ICONVERTEM_EMAIL_TAXONOMIES_TYPES,
	ICONVERTEM_MAIL_POST_METAS,
} from '@iconvertem/constants';
import { useIconvertemNotices } from '@iconvertem/admin-pages/core/notices';
import { IcemModal } from '@iconvertem/admin-pages/components/icem-modal';
import { IcemButton, IcemInput } from '@iconvertem/admin-pages/components';

const EditTemplateModal = ({ onClose, post, isEditingMode }) => {
	const defaultTemplateName =
		post?.title?.rendered || __('New Template', 'iconvert-email-marketer');
	const [templateName, setTemplateName] = useState(defaultTemplateName);

	const defaultEmailSubject =
		post?.[ICONVERTEM_MAIL_POST_METAS.MAIL_SUBJECT] ||
		__('Test Email', 'iconvert-email-marketer');
	const [emailSubject, setEmailSubject] = useState(defaultEmailSubject);
	const [isPending, setIsPending] = useState(false);
	const isPendingRef = useRef(false);
	const { createSuccessIconvertemNotice, createErrorIconvertemNotice } =
		useIconvertemNotices();
	const onUpdateTemplate = async () => {
		if (isPendingRef.current) {
			return;
		}

		isPendingRef.current = true;
		setIsPending(true);

		const data = {
			title: templateName,
			email_type: ICONVERTEM_EMAIL_TAXONOMIES_TYPES.NEWSLETTER,
			email_subject: emailSubject,
			post_id: post?.id,
		};

		try {
			const res = await apiFetch({
				path: addQueryArgs('iconvertem/v1/update-template'),
				method: 'POST',
				data,
			});
			window.location.reload();
		} catch (e) {
			console.error(e);
			createErrorIconvertemNotice(
				__('Encountered error on update', 'iconvert-email-marketer')
			);
		} finally {
			onClose();
			isPendingRef.current = false;
			setIsPending(false);
		}
	};
	const footerComponent = (
		<>
			<IcemButton
				onClick={onUpdateTemplate}
				isBusy={isPending}
				isPrimary
				variant="secondary"
				disabled={!templateName || !emailSubject}
			>
				{__('Apply Changes', 'iconvert-email-marketer')}
			</IcemButton>
		</>
	);
	return (
		<IcemModal
			className="iconvertem-edit-template-modal"
			onRequestClose={onClose}
			title={__('Edit Template', 'iconvert-email-marketer')}
			description={__(
				'Edit your newsletter template settings',
				'iconvert-email-marketer'
			)}
			footerComponent={footerComponent}
		>
			<IcemInput
				label={__('Template name', 'iconvert-email-marketer')}
				value={templateName}
				onChange={setTemplateName}
			/>
			<IcemInput
				label={__('Email subject', 'iconvert-email-marketer')}
				value={emailSubject}
				onChange={setEmailSubject}
			/>
		</IcemModal>
	);
};
export { EditTemplateModal };
