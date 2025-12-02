import { __ } from '@wordpress/i18n';
import { useRef, useState } from '@wordpress/element';
import { redirectToEditorPage } from '../../utils';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	IcemInput,
	NewTemplatesList,
} from '@iconvertem/admin-pages/components';
import { ICONVERTEM_EMAIL_TAXONOMIES_TYPES } from '@iconvertem/constants';
import { getBackendData } from '@iconvertem/utils';
import { IcemModal } from '@iconvertem/admin-pages/components/icem-modal';

const templatesList = getBackendData('new_template_data.templates');

const NewTemplateModal = ({ onClose }) => {
	const [templateName, setTemplateName] = useState(
		__('New Template', 'iconvert-email-marketer')
	);

	const [emailSubject, setEmailSubject] = useState(
		__('Test Email', 'iconvert-email-marketer')
	);
	const [isPending, setIsPending] = useState(false);
	const isPendingRef = useRef(false);
	const onCreateTemplate = async (activeTemplateId) => {
		if (isPendingRef.current) {
			return;
		}

		isPendingRef.current = true;
		setIsPending(true);
		onClose();
		const data = {
			title: templateName,
			email_type: ICONVERTEM_EMAIL_TAXONOMIES_TYPES.NEWSLETTER,
			email_subject: emailSubject,
		};
		if (activeTemplateId) {
			data.template_id = activeTemplateId;
		}

		try {
			const res = await apiFetch({
				path: addQueryArgs('iconvertem/v1/create-template'),
				method: 'POST',
				data,
			});
			redirectToEditorPage(res?.data?.id);
		} catch (e) {
			console.error(e);
			onClose();
			isPendingRef.current = false;
			setIsPending(false);
		} finally {
		}
	};
	return (
		<IcemModal
			className="iconvertem-new-template-modal iconvertem-new-template-modal--newsletter"
			onRequestClose={onClose}
			title={__('Add New Template', 'iconvert-email-marketer')}
			description={__(
				'Configure your newsletter template settings',
				'iconvert-email-marketer'
			)}
		>
			<div className="iconvertem-new-template-modal__form">
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
			</div>

			<NewTemplatesList
				templatesList={templatesList}
				setActiveTemplateId={onCreateTemplate}
			/>
		</IcemModal>
	);
};
export { NewTemplateModal };
