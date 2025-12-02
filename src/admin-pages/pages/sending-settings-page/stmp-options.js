import { usePluginData } from '@iconvertem/admin-pages/core/hooks';

import { __ } from '@wordpress/i18n';
import { IcemInput, IcemSelect } from '@iconvertem/admin-pages/components';

const SmtpOptions = () => {
	const { usePathData } = usePluginData();
	const basePath = 'emailProvidersSettings.props.optionsByProvider.smtp';
	return (
		<>
			<IcemInput
				label={__('SMTP Host', 'iconvert-email-marketer')}
				{...usePathData(`${basePath}.host`)}
			/>
			<IcemInput
				label={__('SMTP Port', 'iconvert-email-marketer')}
				type="numeric"
				{...usePathData(`${basePath}.port`)}
			/>
			<IcemInput
				label={__('SMTP Username', 'iconvert-email-marketer')}
				{...usePathData(`${basePath}.username`)}
			/>
			<IcemInput
				label={__('SMTP Password', 'iconvert-email-marketer')}
				type="password"
				{...usePathData(`${basePath}.password`)}
			/>
			<IcemSelect
				label={__('Select Email Provider', 'iconvert-email-marketer')}
				{...usePathData(`${basePath}.encryption`)}
				options={encryptionOptions}
			/>
		</>
	);
};
const encryptionOptions = [
	{
		label: __('None', 'iconvert-email-marketer'),
		value: '',
	},
	{
		label: __('TLS', 'iconvert-email-marketer'),
		value: 'tls',
	},
	{
		label: __('SSL', 'iconvert-email-marketer'),
		value: 'ssl',
	},
];
export { SmtpOptions };
