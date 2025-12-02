import { IcemSelect } from '@iconvertem/admin-pages/components';
import { __ } from '@wordpress/i18n';

const options = [
	{ label: __('Select', 'iconvert-email-marketer'), value: null },
];
const PlaceholderSelectEventFormPicker = () => {
	return (
		<IcemSelect
			className="iconvertem-new-template-modal__placeholder-select-event-form"
			label={__('Select Form', 'iconvert-email-marketer')}
			value={null}
			options={options}
			disabled={true}
		/>
	);
};

export { PlaceholderSelectEventFormPicker };
