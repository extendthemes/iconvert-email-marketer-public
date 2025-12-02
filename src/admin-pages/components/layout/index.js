import { __ } from '@wordpress/i18n';
import { IcemSectionTitle } from '@iconvertem/admin-pages/components/icem-section-title';

const Layout = ({
	children,
	headerTitle,
	headerDescription,
	headerActionComponent,
}) => {
	return (
		<div className="iconvertem-admin-page-layout">
			<h2 className="iconvertem-admin-page-layout__header">
				{__('iConvert Email Marketer', 'iconvert-email-marketer')}
			</h2>

			<div className="iconvertem-admin-page-layout__content">
				<IcemSectionTitle
					actionComponent={headerActionComponent}
					title={headerTitle}
					description={headerDescription}
				/>
				{children}
			</div>
		</div>
	);
};

export { Layout };
