import { Button, Dropdown } from '@wordpress/components';
import { FontsList } from './fonts/fonts-list';
import { ucwords } from '@kubio/utils';
import { useDispatch } from '@wordpress/data';
import { STORE_KEY } from '@kubio/constants';
import { __ } from '@wordpress/i18n';
import { Icon, chevronDown } from '@wordpress/icons';
import classnames from 'classnames';

const FontPicker = ({
	value,
	onChange,
	placeholder = __('Select…', 'kubio'),
}) => {
	const onFontChange = (font, closePopover) => {
		onChange(font);
		closePopover();
	};

	const { openSidebar } = useDispatch(STORE_KEY) || {};

	let label;
	const showPlaceholder = !value;
	if (!showPlaceholder) {
		label = ucwords((value || '').replace(/-/gi, ' '));
	} else {
		label = placeholder;
	}

	return (
		<div
			className={classnames(
				'kubio-font-picker-container',
				'kubio-control'
			)}
		>
			<Dropdown
				contentClassName="kubio-fontpicker-content"
				renderToggle={({ isOpen, onToggle }) => (
					<div className={'kubio-fonts-dropdown'}>
						<Button
							className={classnames('kubio-font-picker-button', {
								'kubio-font-picker-button--placeholder': showPlaceholder,
							})}
							isSecondary
							onClick={onToggle}
							aria-expanded={isOpen}
						>
							<div className={'float-left'}>{label.split(',')[0]}</div>
							<div className={'float-right'}>
								<Icon
									icon={chevronDown}
									className="h-select-control__button-icon"
								/>
							</div>
						</Button>
					</div>
				)}
				renderContent={({ onClose }) => (
					<div className="fonts-list">
						<FontsList
							onChange={(e) => onFontChange(e, onClose)}
							value={value}
						/>
						{openSidebar && (
							<div className={'kubio-font-footer'}>
								<Button
									onClick={() =>
										openSidebar(
											'document/general-settings/typography'
										)
									}
								>
									{__('Manage font providers', 'kubio')}
								</Button>
							</div>
						)}
					</div>
				)}
			/>
		</div>
	);
};

export { FontPicker };
