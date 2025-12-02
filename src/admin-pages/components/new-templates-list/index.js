import { useMemo, useState } from '@wordpress/element';
import { CategoriesList } from './categories-list';
import { TemplatesList } from './templates-list';
import { __ } from '@wordpress/i18n';
import { getBackendData } from '@iconvertem/utils';

import { Search } from '@iconvertem/admin-pages/pages/newsletter-emails-page/search';

const categories = getBackendData('new_template_data.terms', []);

const BLANK_TEMPLATE = {
	id: null,
	name: __('Start from blank', 'iconvert-email-marketer'),
	is_blank: true,
	image: getBackendData('new_template_data.blankImage'),
};
const ALL_CATEGORY_SLUG = 'all_category';
const ALL_CATEGORY = {
	id: -1,
	slug: ALL_CATEGORY_SLUG,
	name: 'All',
};
const NewTemplatesList = ({
	templatesList,
	activeTemplateId,
	setActiveTemplateId,
	showSearchInput = true,
	showCategoryList = true,
}) => {
	const [activeCategorySlug, setActiveCategorySlug] =
		useState(ALL_CATEGORY_SLUG);
	const [searchFilter, setSearchFilter] = useState('');
	const categoriesWithAll = useMemo(() => {
		return [ALL_CATEGORY].concat(categories);
	}, []);

	const filteredTemplates = useMemo(() => {
		let templatesFilteredByCategory = templatesList;
		if (activeCategorySlug !== ALL_CATEGORY_SLUG) {
			templatesFilteredByCategory = templatesList.filter((template) => {
				return template?.categories === activeCategorySlug;
			});
		}
		let templatesFilteredByCategoryAndSearch = templatesFilteredByCategory;
		if (searchFilter) {
			templatesFilteredByCategoryAndSearch =
				templatesFilteredByCategory.filter((item) => {
					return item?.name
						?.toLowerCase?.()
						?.includes(searchFilter?.toLowerCase?.());
				});
		}
		return templatesFilteredByCategoryAndSearch.concat([BLANK_TEMPLATE]);
	}, [activeCategorySlug, searchFilter]);
	return (
		<div className="iconvertem-new-template-list__container">
			<div className="iconvertem-new-template-list__filters-container">
				{showCategoryList && (
					<CategoriesList
						categories={categoriesWithAll}
						activeCategorySlug={activeCategorySlug}
						setActiveCategorySlug={setActiveCategorySlug}
					/>
				)}
				{showSearchInput && (
					<Search
						value={searchFilter}
						onChange={setSearchFilter}
						placeholder={__(
							'Search template',
							'iconvert-email-marketer'
						)}
					/>
				)}
			</div>
			<div className="iconvertem-new-template-list__templates__container">
				<TemplatesList
					activeTemplateId={activeTemplateId}
					setActiveTemplateId={setActiveTemplateId}
					templates={filteredTemplates}
				/>
			</div>
		</div>
	);
};

export { NewTemplatesList };
