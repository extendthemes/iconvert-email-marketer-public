import { Search } from '@iconvertem/admin-pages/pages/newsletter-emails-page/search';
import { IcemButton } from '@iconvertem/admin-pages/components/icem-button';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

const SearchAndAddComponent = ({
	searchString,
	setSearchString,
	addButtonAction,
}) => {
	return (
		<div className="icem-search-and-add-component">
			<Search value={searchString} onChange={setSearchString} />
			<IcemButton onClick={addButtonAction} icon={plus}>
				{__('Add template', 'iconvert-email-marketer')}
			</IcemButton>
		</div>
	);
};

export { SearchAndAddComponent };
