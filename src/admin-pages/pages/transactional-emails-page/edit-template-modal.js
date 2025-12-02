import { __ } from '@wordpress/i18n';
import { Fragment, useRef, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	EMPTY_SELECT_VALUE,
	ICONVERTEM_EMAIL_TAXONOMIES_TYPES,
	ICONVERTEM_MAIL_POST_METAS,
	SENDING_EVENT_VALUES,
	SENDING_EVENTS_OPTIONS,
} from '@iconvertem/constants';
import { useIconvertemNotices } from '@iconvertem/admin-pages/core/notices';

import { ContactForm7Picker } from './new-template-modal/contact-form-7-picker';
import { PromoterFormsPicker } from './new-template-modal/promoter-forms-picker';
import { IcemModal } from '@iconvertem/admin-pages/components/icem-modal';
import {
	IcemButton,
	IcemInput,
	IcemSelect,
} from '@iconvertem/admin-pages/components';

const EditTemplateModal = ({ onClose, post }) => {
	const defaultTemplateName =
		post?.title?.rendered || __('New Template', 'iconvert-email-marketer');
	const [templateName, setTemplateName] = useState(defaultTemplateName);

	const defaultEmailSubject =
		post?.[ICONVERTEM_MAIL_POST_METAS.MAIL_SUBJECT] ||
		__('Test Email', 'iconvert-email-marketer');
	const [emailSubject, setEmailSubject] = useState(defaultEmailSubject);
	const [isPending, setIsPending] = useState(false);
	const isPendingRef = useRef(false);
	const [sendingEventType, setInternalSendingEventType] = useState(
		post?.[ICONVERTEM_MAIL_POST_METAS.SENDING_EVENT_TYPE]
	);

	const setSendingEventType = (newValue) => {
		if (newValue === EMPTY_SELECT_VALUE) {
			return;
		}
		setInternalSendingEventType(newValue);
	};
	const [sendingEventFormId, setSendingEventFormId] = useState(
		parseInt(post?.[ICONVERTEM_MAIL_POST_METAS.SENDING_EVENT_FORM_ID]) || ''
	);
	const [sendingEventData, setSendingEventData] = useState();
	const { createSuccessIconvertemNotice, createErrorIconvertemNotice } =
		useIconvertemNotices();

	const sendingEventHasRequiredData =
		sendingEventType && (sendingEventFormId || sendingEventData);
	const onUpdateTemplate = async () => {
		if (isPendingRef.current) {
			return;
		}

		isPendingRef.current = true;
		setIsPending(true);

		if (!sendingEventHasRequiredData) {
			alert('Missing sending event data');
			return;
		}

		const data = {
			post_id: post?.id,
			title: templateName,
			email_type: ICONVERTEM_EMAIL_TAXONOMIES_TYPES.TRANSACTIONAL,
			email_subject: emailSubject,
			sending_event_type: sendingEventType,
			sending_event_form_id: sendingEventFormId,
			sending_event_data: sendingEventData,
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

	let SendingEventComponent = Fragment;
	switch (sendingEventType) {
		case SENDING_EVENT_VALUES.AFTER_CONTACT_FORM_7_SUBMISSION:
			SendingEventComponent = ContactForm7Picker;

			break;
		case SENDING_EVENT_VALUES.AFTER_PROMOTER_SUBMIT_FORM_SUBMISSION:
			SendingEventComponent = PromoterFormsPicker;
			break;
		default:
	}
	const footerComponent = (
		<>
			<IcemButton
				onClick={onUpdateTemplate}
				isPrimary
				variant="secondary"
				isBusy={isPending}
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
				'Edit your transactional email template settings',
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
			<IcemSelect
				label={__('Sending Event', 'iconvert-email-marketer')}
				value={sendingEventType}
				onChange={setSendingEventType}
				options={SENDING_EVENTS_OPTIONS}
			/>

			<SendingEventComponent
				sendingEventFormId={sendingEventFormId}
				setSendingEventFormId={setSendingEventFormId}
				sendingEventData={sendingEventData}
				setSendingEventData={setSendingEventData}
			/>
		</IcemModal>
	);
};
export { EditTemplateModal };
