import classnames from 'classnames';
import { IcemButton } from '@iconvertem/admin-pages/components';
import { __ } from '@wordpress/i18n';
const TemplatesList = ({
	templates,
	activeTemplateId,
	setActiveTemplateId,
}) => {
	return (
		<div className="iconvertem-new-template-list">
			{templates.map(({ id, image, name }) => {
				const isActive = id === activeTemplateId;
				return (
					<div
						className={classnames(
							'iconvertem-new-template-list__item',
							{
								'iconvertem-new-template-list__item--active':
									isActive,
							}
						)}
					>
						<div className="iconvertem-new-template-list__item__image__container">
							<img src={image} alt={name} />
							<div className="iconvertem-new-template-list__item__image__blur" />
							<IcemButton
								className="iconvertem-new-template-list__item__image__button"
								onClick={() => {
									setActiveTemplateId(id);
								}}
							>
								{__(
									'Start from this template',
									'iconvert-email-marketer'
								)}
							</IcemButton>
						</div>

						<div className="iconvertem-new-template-list__item__title">
							{name}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export { TemplatesList };
