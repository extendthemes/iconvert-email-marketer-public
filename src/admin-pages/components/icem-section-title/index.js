const IcemSectionTitle = ({ title, description, actionComponent }) => {
	return (
		<div className="icem-section-title">
			<div className="icem-section-title__title_and_desc">
				<h3 className="icem-section-title__title">{title}</h3>
				<div className="icem-section-title__description">
					{description}
				</div>
			</div>
			<div className="icem-section-title__action">
				{actionComponent && actionComponent}
			</div>
		</div>
	);
};

export { IcemSectionTitle };
