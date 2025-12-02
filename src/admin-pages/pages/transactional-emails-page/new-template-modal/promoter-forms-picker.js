import { getBackendData, getPromoterFormsOptions } from '@iconvertem/utils';
import { GenericFormPicker } from './generic-form-picker';
import { __ } from '@wordpress/i18n';
const PromoterFormsPicker = ({ sendingEventFormId, setSendingEventFormId }) => {
	return (
		<GenericFormPicker
			sendingEventFormId={sendingEventFormId}
			setSendingEventFormId={setSendingEventFormId}
			getFormsFunc={getPromoterFormsOptions}
			noFormMessage={
				<span>
					{__(
						'No promoter forms available.',
						'iconvert-email-marketer'
					)}
				</span>
			}
			pluginNotInstalledMessage={
				<span>
					{__(
						'Promoter plugin is not active.',
						'iconvert-email-marketer'
					)}
					&nbsp;
					<a
						href="https://wordpress.org/plugins/iconvert-promoter/"
						target="_blank"
						rel="noreferrer"
					>
						{__('Plugin page', 'iconvert-email-marketer')}
					</a>
				</span>
			}
			thirdPartyPluginIsActive={getBackendData('promoter_is_active')}
		/>
	);
};

export { PromoterFormsPicker };
