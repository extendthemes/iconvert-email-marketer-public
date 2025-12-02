import { usePluginData } from '@iconvertem/admin-pages/core/hooks';

import { __ } from '@wordpress/i18n';
import { IcemInput } from '@iconvertem/admin-pages/components';

const MooSendOptions = () => {
	const { usePathData } = usePluginData();
	const basePath = 'emailProvidersSettings.props.optionsByProvider.mooSend';
	return (
		<>
			<IcemInput
				label={__('Api Key', 'iconvert-email-marketer')}
				type="password"
				{...usePathData(`${basePath}.apiKey`)}
			/>
		</>
	);
};

export { MooSendOptions };
