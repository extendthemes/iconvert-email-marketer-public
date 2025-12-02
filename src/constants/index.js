import { getBackendData } from '@iconvertem/utils';
import { __ } from '@wordpress/i18n';
const ICONVERTEM_DATA_HELPER_POST_TYPE = 'icem-settings-data';
const ICONVERTEM_TEMPLATE_ENTITY_TYPE = 'icem-mail-tpl';

const ICONVERTEM_TAXONOMY_SLUG = 'icem-mail-tpl-taxonomy-type';
const ICONVERTEM_EMAIL_TAXONOMIES_TYPES = {
	TRANSACTIONAL: 'icem-mail-tpl-taxonomy-type-transactional',
	NEWSLETTER: 'icem-mail-tpl-taxonomy-type-newsletter',
};

const ICONVERTEM_MAIL_POST_METAS = {
	MAIL_SUBJECT: '_iconvertem_email_subject',
	SENDING_EVENT_TYPE: '_iconvertem_email_sending_event_type',
	SENDING_EVENT_FORM_ID: '_iconvertem_email_sending_event_form_id',
	DISABLED: '_iconvertem_email_disabled',
};
const SENDING_EVENT_VALUES = {
	AFTER_CONTACT_FORM_7_SUBMISSION: 'afterContactForm7Submission',
	AFTER_PROMOTER_SUBMIT_FORM_SUBMISSION: 'afterPromoterSubmitFormSubmission',
};
const EMPTY_SELECT_VALUE = 'EMPTY_SELECT_VALUE';
const SENDING_EVENTS_OPTIONS = [
	{
		label: __('Select', 'iconvert-email-marketer'),
		value: EMPTY_SELECT_VALUE,
	},
	{
		label: __('After contact form submission', 'iconvert-email-marketer'),
		value: SENDING_EVENT_VALUES.AFTER_CONTACT_FORM_7_SUBMISSION,
	},
	{
		label: __(
			'After email capture form submission',
			'iconvert-email-marketer'
		),
		value: SENDING_EVENT_VALUES.AFTER_PROMOTER_SUBMIT_FORM_SUBMISSION,
	},
];
const taxonomiesTerms = getBackendData('main_taxonomies_terms', []);
const getTaxonomyTermBySlug = (slug) => {
	return taxonomiesTerms?.find((term) => term.slug === slug)?.id;
};
const ICONVERTEM_EMAIL_TAXONOMIES_ID_BY_TYPE = {
	[ICONVERTEM_EMAIL_TAXONOMIES_TYPES.NEWSLETTER]: getTaxonomyTermBySlug(
		ICONVERTEM_EMAIL_TAXONOMIES_TYPES.NEWSLETTER
	),
	[ICONVERTEM_EMAIL_TAXONOMIES_TYPES.TRANSACTIONAL]: getTaxonomyTermBySlug(
		ICONVERTEM_EMAIL_TAXONOMIES_TYPES.TRANSACTIONAL
	),
};
export {
	ICONVERTEM_TEMPLATE_ENTITY_TYPE,
	ICONVERTEM_EMAIL_TAXONOMIES_TYPES,
	ICONVERTEM_TAXONOMY_SLUG,
	ICONVERTEM_EMAIL_TAXONOMIES_ID_BY_TYPE,
	ICONVERTEM_MAIL_POST_METAS,
	SENDING_EVENT_VALUES,
	SENDING_EVENTS_OPTIONS,
	EMPTY_SELECT_VALUE,
	ICONVERTEM_DATA_HELPER_POST_TYPE,
};
