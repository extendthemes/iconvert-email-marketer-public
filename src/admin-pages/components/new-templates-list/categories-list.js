import classnames from 'classnames';

const CategoriesList = ({
	categories,
	activeCategorySlug,
	setActiveCategorySlug,
}) => {
	return (
		<div className="iconvertem-new-template-list__category-list">
			{categories.map(({ name, slug }) => {
				const isActive = slug === activeCategorySlug;
				const onClick = () => {
					if (isActive) {
						return;
					}
					setActiveCategorySlug(slug);
				};
				return (
					<div
						key={slug}
						onClick={onClick}
						className={classnames(
							'iconvertem-new-template-list__category-list__item',
							{
								'iconvertem-new-template-list__category-list__item--active':
									isActive,
							}
						)}
					>
						{name}
					</div>
				);
			})}
		</div>
	);
};
export { CategoriesList };
