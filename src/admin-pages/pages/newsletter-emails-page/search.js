import { __ } from '@wordpress/i18n';
import { IcemInput } from '@iconvertem/admin-pages/components/icem-input';
import { Icon, search } from '@wordpress/icons';

const Search = ({
	value,
	onChange,
	placeholder = __('Search Template', 'iconvert-email-marketer'),
}) => {
	return (
		<div className="icem-search-template-input__container">
			<IcemInput
				value={value}
				onChange={onChange}
				placeholder={placeholder}
			/>
			<Icon
				icon={search}
				className="icem-search-template-input__search-icon"
			/>
		</div>
	);
};
export { Search };
