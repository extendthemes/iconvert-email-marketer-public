import { __ } from '@wordpress/i18n';
import { IcemButton } from '@iconvertem/admin-pages/components';
const IcemTablePagination = ({
	currentPage,
	setCurrentPage,
	elementsPerPage,
	totalNumberOfTemplates,
}) => {
	const showPagination = totalNumberOfTemplates > elementsPerPage;
	if (!showPagination || totalNumberOfTemplates === 0) {
		return <></>;
	}

	const maxPage = Math.ceil(totalNumberOfTemplates / elementsPerPage);
	const minPage = 0;
	const showNext = currentPage + 1 < maxPage;
	const showBack = currentPage !== minPage;
	const onNext = () => {
		if (currentPage < maxPage) {
			setCurrentPage(currentPage + 1);
		}
	};
	const onPrevious = () => {
		if (currentPage > minPage) {
			setCurrentPage(currentPage - 1);
		}
	};
	return (
		<div className="icem-table__pagination">
			{showBack && (
				<IcemButton onClick={onPrevious}>
					{__('Previous Page', 'iconvert-email-marketer')}
				</IcemButton>
			)}
			{showNext && (
				<IcemButton onClick={onNext}>
					{__('Next Page', 'iconvert-email-marketer')}
				</IcemButton>
			)}
		</div>
	);
};

export { IcemTablePagination };
