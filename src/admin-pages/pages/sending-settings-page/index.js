import { Layout } from '../../components/layout';
import { usePluginData } from '@iconvertem/admin-pages/core/hooks';
import { __, sprintf } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { SmtpOptions } from './stmp-options';
import { SendGridOptions } from './send-grid-options';
import { MooSendOptions } from './moo-send-options';
import { MailJetOptions } from './mail-jet-options';
import { CampaignMonitorOptions } from './campaign-monitor-options';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import {
	IcemButton,
	IcemInput,
	RadioGroupWithIcons,
} from '@iconvertem/admin-pages/components';
import {
	ProviderCampaignMonitorIcon,
	ProviderCustomSmtpIcon,
	ProviderMailjetIcon,
	ProviderNoneIcon,
	ProviderSendgridIcon,
} from '@iconvertem/admin-pages/icons';

const PROVIDER_VALUES = {
	SMTP: 'smtp',
	SEND_GRID: 'send-grid',
	MOO_SEND: 'moo-send',
	MAIL_JET: 'mail-jet',
	CAMPAIGN_MONITOR: 'campaign-monitor',
};

const providersOptions = [
	{
		label: __('None', 'iconvert-email-marketer'),
		value: '',
		IconComponent: ProviderNoneIcon,
	},
	{
		label: __('Custom SMTP', 'iconvert-email-marketer'),
		value: PROVIDER_VALUES.SMTP,
		IconComponent: ProviderCustomSmtpIcon,
	},
	{
		label: __('SendGrid', 'iconvert-email-marketer'),
		value: PROVIDER_VALUES.SEND_GRID,
		IconComponent: ProviderSendgridIcon,
	},

	//not implemented
	// {
	// 	label: __('MooSend', 'iconvert-email-marketer'),
	// 	value: PROVIDER_VALUES.MOO_SEND,
	// },
	{
		label: __('MailJet', 'iconvert-email-marketer'),
		value: PROVIDER_VALUES.MAIL_JET,
		IconComponent: ProviderMailjetIcon,
	},
	{
		label: __('Campaign Monitor', 'iconvert-email-marketer'),
		value: PROVIDER_VALUES.CAMPAIGN_MONITOR,
		IconComponent: ProviderCampaignMonitorIcon,
	},
];

const SendingSettingsPage = () => {
	const { onSave, usePathData, pluginDataHasChanges } = usePluginData();

	const emailProvider = usePathData(
		'emailProvidersSettings.props.selectedProvider'
	);

	let ProviderOptionsComponent = Fragment;

	switch (emailProvider.value) {
		case PROVIDER_VALUES.SMTP:
			ProviderOptionsComponent = SmtpOptions;
			break;
		case PROVIDER_VALUES.SEND_GRID:
			ProviderOptionsComponent = SendGridOptions;
			break;
		case PROVIDER_VALUES.MOO_SEND:
			ProviderOptionsComponent = MooSendOptions;
			break;
		case PROVIDER_VALUES.MAIL_JET:
			ProviderOptionsComponent = MailJetOptions;
			break;
		case PROVIDER_VALUES.CAMPAIGN_MONITOR:
			ProviderOptionsComponent = CampaignMonitorOptions;
			break;

		case PROVIDER_VALUES.default:
			ProviderOptionsComponent = Fragment;
	}

	const onSendTestEmail = async () => {
		try {
			await apiFetch({
				path: addQueryArgs(
					'iconvertem/v1/sending-options/send-test-email'
				),
				method: 'POST',
			});
			alert(__('Send succesfully', 'iconvert-email-marketer'));
		} catch (e) {
			const message = e?.message;
			alert(sprintf(__(`Error:%s`, 'iconvert-email-marketer'), message));
			console.error(e);
		}
	};
	const onTestConnection = async () => {
		try {
			await apiFetch({
				path: addQueryArgs(
					'iconvertem/v1/sending-options/test-connection'
				),
				method: 'POST',
			});
			alert(__('Connection is ok', 'iconvert-email-marketer'));
		} catch (e) {
			const message = e?.message;

			alert(sprintf(__(`Error: %s`, 'iconvert-email-marketer'), message));
			console.error(e);
		}
	};

	const hasProviderSelected = !!emailProvider?.value;
	return (
		<Layout
			headerTitle={__('Sending Settings', 'iconvert-email-marketer')}
			headerDescription={__(
				'Configure your email sending integrations',
				'iconvert-email-marketer'
			)}
		>
			<div className="icem-settings-page__content">
				<div className="icem-settings-page__content__card">
					<IcemInput
						label={__('From Name', 'iconvert-email-marketer')}
						{...usePathData(
							'emailProvidersSettings.props.fromName'
						)}
					/>
					<IcemInput
						label={__('From Email', 'iconvert-email-marketer')}
						{...usePathData(
							'emailProvidersSettings.props.fromEmail'
						)}
					/>
					<RadioGroupWithIcons
						label={__(
							'Select Email Provider',
							'iconvert-email-marketer'
						)}
						{...emailProvider}
						options={providersOptions}
					/>

					{hasProviderSelected && (
						<>
							<br />
							<hr />
							<br />
							<ProviderOptionsComponent />
						</>
					)}
					<br />
					<hr />
					<br />
					<div className="icem-settings-page__content__card__footer">
						<IcemButton
							isPrimary
							variant="secondary"
							onClick={onTestConnection}
							disabled={pluginDataHasChanges}
						>
							{__('Test Connection', 'iconvert-email-marketer')}
						</IcemButton>
						<IcemButton
							variant="secondary"
							isPrimary
							onClick={onSendTestEmail}
							disabled={pluginDataHasChanges}
						>
							{__('Send Test Email', 'iconvert-email-marketer')}
						</IcemButton>

						<IcemButton
							isPrimary
							onClick={onSave}
							disabled={!pluginDataHasChanges}
						>
							{__('Save', 'iconvert-email-marketer')}
						</IcemButton>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export { SendingSettingsPage };
