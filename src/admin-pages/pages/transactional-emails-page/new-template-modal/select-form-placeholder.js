import { __ } from '@wordpress/i18n';

const SelectFormPlaceholder = () => {
	return (
		<div className="iconvertem-new-template-modal__select-form-placeholder">
			<FormPlaceholderIcon />
			<h3 className="iconvertem-new-template-modal__select-form-placeholder__title">
				{__(
					'Select a sending event and a form',
					'iconvert-email-marketer'
				)}
			</h3>
			<div className="iconvertem-new-template-modal__select-form-placeholder__description">
				{__(
					'Choose a sending event to view available templates',
					'iconvert-email-marketer'
				)}
			</div>
		</div>
	);
};

const FormPlaceholderIcon = () => {
	return (
		<svg
			width="72"
			height="72"
			viewBox="0 0 72 72"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M40.7178 17.964L14.9708 21.5825C13.3301 21.8131 12.1869 23.3301 12.4175 24.9708L16.8711 56.6594C17.1016 58.3001 18.6187 59.4433 20.2594 59.2127L46.0064 55.5942C47.6471 55.3636 48.7902 53.8466 48.5596 52.2058L44.1061 20.5173C43.8755 18.8765 42.3585 17.7334 40.7178 17.964Z"
				fill="#E5E5E5"
			/>
			<path
				d="M52.8411 21.0313L26.9836 18.3136C25.3358 18.1404 23.8596 19.3358 23.6864 20.9836L20.3415 52.8083C20.1683 54.456 21.3637 55.9322 23.0115 56.1054L48.8691 58.8232C50.5168 58.9963 51.993 57.801 52.1662 56.1532L55.5111 24.3285C55.6843 22.6807 54.4889 21.2045 52.8411 21.0313Z"
				fill="#D4D4D4"
			/>
			<path
				d="M49 16H23C21.3431 16 20 17.3431 20 19V53C20 54.6569 21.3431 56 23 56H49C50.6569 56 52 54.6569 52 53V19C52 17.3431 50.6569 16 49 16Z"
				fill="white"
				stroke="#A3A3A3"
				strokeWidth="1.5"
			/>
			<path
				d="M28 26L36 31L44 26"
				stroke="#737373"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M42.5 26H29.5C28.6716 26 28 26.6716 28 27.5V36.5C28 37.3284 28.6716 38 29.5 38H42.5C43.3284 38 44 37.3284 44 36.5V27.5C44 26.6716 43.3284 26 42.5 26Z"
				stroke="#737373"
				strokeWidth="1.5"
			/>
			<path
				d="M28 42H40"
				stroke="#D4D4D4"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M28 46H44"
				stroke="#D4D4D4"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M28 50H36"
				stroke="#D4D4D4"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<g clipPath="url(#clip0_104_7002)">
				<path
					d="M66 0L66.7 4.3L71 5L66.7 5.7L66 10L65.3 5.7L61 5L65.3 4.3L66 0Z"
					fill="#D4D4D4"
				/>
			</g>
			<g clipPath="url(#clip1_104_7002)">
				<path
					d="M5.00004 62L5.58337 65.5833L9.16671 66.1667L5.58337 66.75L5.00004 70.3333L4.41671 66.75L0.833374 66.1667L4.41671 65.5833L5.00004 62Z"
					fill="#D4D4D4"
				/>
			</g>
			<defs>
				<clipPath id="clip0_104_7002">
					<rect
						width="12"
						height="12"
						fill="white"
						transform="translate(60)"
					/>
				</clipPath>
				<clipPath id="clip1_104_7002">
					<rect
						width="10"
						height="10"
						fill="white"
						transform="translate(0 62)"
					/>
				</clipPath>
			</defs>
		</svg>
	);
};
export { SelectFormPlaceholder };
