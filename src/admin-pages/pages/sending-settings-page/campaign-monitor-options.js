import { usePluginData } from '@iconvertem/admin-pages/core/hooks';

import { __ } from '@wordpress/i18n';
import { IcemInput } from '@iconvertem/admin-pages/components';

const CampaignMonitorOptions = () => {
	const { usePathData } = usePluginData();
	const basePath =
		'emailProvidersSettings.props.optionsByProvider.campaignMonitor';
	return (
		<>
			<IcemInput
				label={__('Api Key', 'iconvert-email-marketer')}
				type="password"
				{...usePathData(`${basePath}.apiKey`)}
			/>
			<IcemInput
				label={__('Client ID', 'iconvert-email-marketer')}
				type="password"
				{...usePathData(`${basePath}.clientId`)}
			/>
		</>
	);
};

export { CampaignMonitorOptions };
