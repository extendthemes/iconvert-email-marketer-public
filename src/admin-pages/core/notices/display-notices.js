// @ts-nocheck
import { Icon } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import _ from 'lodash';

const DisplayNotices = () => {
	const notices = useSelect((select) => select(noticesStore).getNotices());
	const { removeNotice } = useDispatch(noticesStore);

	if (!notices) {
		return null;
	}

	const iconSelect = (aNotice) => {
		let icon = 'yes-alt';
		switch (aNotice?.status) {
			case 'default':
				icon = 'yes-alt';
				break;
			case 'info':
				icon = 'info';
				break;
			case 'success':
				icon = 'yes-alt';
				break;
			case 'error':
				icon = 'dismiss';
				break;
			case 'warning':
				icon = 'warning';
				break;
			default:
				icon = 'yes-alt';
				break;
		}

		return icon;
	};

	return (
		<div className="iconvertem-notice-holder">
			{notices.map((notice) => {
				return (
					<div
						key={notice.id}
						className={`iconvertem-notice notice is-dismissible notice-${notice?.status}`}
					>
						<Icon
							className={'left-icon'}
							icon={iconSelect(notice)}
						/>
						{notice?.status && (
							<h3>{_.capitalize(notice.status)}!</h3>
						)}
						{notice.content && <p>{notice.content}</p>}
						<button
							type="button"
							className="components-button has-icon"
							aria-label="Close notice"
							onClick={() => {
								removeNotice(notice.id);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="24"
								height="24"
								aria-hidden="true"
								focusable="false"
							>
								<path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path>
							</svg>
						</button>
					</div>
				);
			})}
		</div>
	);
};

export { DisplayNotices };
