import { getBackendData } from '@iconvertem/utils';
import moment from 'moment';
import { SENDING_EVENTS_OPTIONS } from '@iconvertem/constants';
import { __ } from '@wordpress/i18n';

const getPostDateTimeFormatted = (postDate) => {
	const dateGMT = postDate;

	const formatted = moment
		.utc(dateGMT)
		.local() // convert to local time
		.format('YYYY-MM-DD');
	return formatted;
};

const redirectToEditorPage = (postId) => {
	if (!postId) {
		return;
	}
	const adminUrl = getBackendData('admin_url');
	const editTemplateUrl = `${adminUrl}/post.php?post=${postId}&action=edit&edit-template=1`;
	window.location = editTemplateUrl;
};

const getSendingEventLabel = (sendingEvent) => {
	const label = SENDING_EVENTS_OPTIONS.find(
		(item) => item.value === sendingEvent
	)?.label;

	return label ? label : __('Not recognized', 'iconvert-email-marketer');
};

export { getPostDateTimeFormatted, redirectToEditorPage, getSendingEventLabel };
