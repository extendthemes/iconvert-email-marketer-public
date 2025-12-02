import { __ } from '@wordpress/i18n';

const EmptyTableContent = () => {
	return (
		<div className="icem-template-list-table--empty-content">
			<h1>{__('No templates found', 'iconvert-email-marketer')}</h1>
		</div>
	);
};
export { EmptyTableContent };
