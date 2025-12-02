import { getContactFormsOptions } from '@iconvertem/utils';
import { GenericFormPicker } from './generic-form-picker';
import { __ } from '@wordpress/i18n';
import { getBackendData } from '@iconvertem/utils';

const ContactForm7Picker = ({ sendingEventFormId, setSendingEventFormId }) => {
	return (
		<GenericFormPicker
			sendingEventFormId={sendingEventFormId}
			setSendingEventFormId={setSendingEventFormId}
			getFormsFunc={getContactFormsOptions}
			noFormMessage={
				<span>
					{__(
						'No  Contact Form 7  forms available.',
						'iconvert-email-marketer'
					)}
				</span>
			}
			pluginNotInstalledMessage={
				<span>
					{__(
						'Contact Form 7 plugin is not active.',
						'iconvert-email-marketer'
					)}
					&nbsp;
					<a
						href="https://wordpress.org/plugins/contact-form-7/"
						target="_blank"
						rel="noreferrer"
					>
						{__('Plugin page', 'iconvert-email-marketer')}
					</a>
				</span>
			}
			thirdPartyPluginIsActive={getBackendData(
				'contact_form_7_is_active'
			)}
		/>
	);
};

export { ContactForm7Picker };
