import { __ } from '@wordpress/i18n';
import { Fragment, useRef, useState } from '@wordpress/element';
import { redirectToEditorPage } from '../../../utils';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	IcemInput,
	IcemSelect,
	NewTemplatesList,
} from '@iconvertem/admin-pages/components';
import {
	EMPTY_SELECT_VALUE,
	ICONVERTEM_EMAIL_TAXONOMIES_TYPES,
	SENDING_EVENT_VALUES,
	SENDING_EVENTS_OPTIONS,
} from '@iconvertem/constants';
import { getBackendData } from '@iconvertem/utils';
import { ContactForm7Picker } from './contact-form-7-picker';
import { PromoterFormsPicker } from './promoter-forms-picker';
import { IcemModal } from '@iconvertem/admin-pages/components/icem-modal';
import { SelectFormPlaceholder } from './select-form-placeholder';
import { PlaceholderSelectEventFormPicker } from './placeholder-select-event-form-picker';
let templatesList = getBackendData('new_template_data.templates', []);
templatesList = templatesList.slice(0, 5);
const NewTemplateModal = ({ onClose }) => {
	const [templateName, setTemplateName] = useState(
		__('New Template', 'iconvert-email-marketer')
	);
	const [emailSubject, setEmailSubject] = useState(
		__('Test Email', 'iconvert-email-marketer')
	);
	const [sendingEventType, setInternalSendingEventType] = useState();
	const [sendingEventFormId, setSendingEventFormId] = useState();
	const [sendingEventData, setSendingEventData] = useState();
	const [isPending, setIsPending] = useState(false);
	const isPendingRef = useRef(false);

	const setSendingEventType = (newValue) => {
		if (newValue === EMPTY_SELECT_VALUE) {
			return;
		}
		setInternalSendingEventType(newValue);
	};
	const sendingEventHasRequiredData = sendingEventType && sendingEventFormId;
	const onCreateTemplate = async (activeTemplateId) => {
		if (isPendingRef.current) {
			return;
		}
		if (!sendingEventHasRequiredData) {
			alert('Missing sending event data');
			return;
		}
		onClose();
		isPendingRef.current = true;
		setIsPending(true);

		const data = {
			title: templateName,
			email_type: ICONVERTEM_EMAIL_TAXONOMIES_TYPES.TRANSACTIONAL,
			email_subject: emailSubject,
			sending_event_type: sendingEventType,
			sending_event_form_id: sendingEventFormId,
			sending_event_data: sendingEventData,
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
	let SendingEventComponent = Fragment;
	switch (sendingEventType) {
		case SENDING_EVENT_VALUES.AFTER_CONTACT_FORM_7_SUBMISSION:
			SendingEventComponent = ContactForm7Picker;

			break;
		case SENDING_EVENT_VALUES.AFTER_PROMOTER_SUBMIT_FORM_SUBMISSION:
			SendingEventComponent = PromoterFormsPicker;
			break;
		default:
			SendingEventComponent = PlaceholderSelectEventFormPicker;
	}
	return (
		<IcemModal
			className="iconvertem-new-template-modal "
			onRequestClose={onClose}
			title={__('Add New Template', 'iconvert-email-marketer')}
			description={__(
				'Configure your transactional email template settings',
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
			</div>
			{!sendingEventHasRequiredData && (
				<div className="iconvertem-new-template-list__templates__container">
					<SelectFormPlaceholder />
				</div>
			)}

			{sendingEventHasRequiredData && (
				<NewTemplatesList
					setActiveTemplateId={onCreateTemplate}
					templatesList={templatesList}
					showCategoryList={false}
					showSearchInput={false}
				/>
			)}
		</IcemModal>
	);
};

export { NewTemplateModal };
