import { usePluginData } from '@iconvertem/admin-pages/core/hooks';

import { __ } from '@wordpress/i18n';
import { IcemInput } from '@iconvertem/admin-pages/components';

const MailJetOptions = () => {
	const { usePathData } = usePluginData();
	const basePath = 'emailProvidersSettings.props.optionsByProvider.mailJet';
	return (
		<>
			<IcemInput
				label={__('Api Key', 'iconvert-email-marketer')}
				type="password"
				{...usePathData(`${basePath}.apiKey`)}
			/>
			<IcemInput
				label={__('Secret Key', 'iconvert-email-marketer')}
				type="password"
				{...usePathData(`${basePath}.secretKey`)}
			/>
		</>
	);
};

export { MailJetOptions };
