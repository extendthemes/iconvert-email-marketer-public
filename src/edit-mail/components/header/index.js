/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useViewportMatch } from '@wordpress/compose';
import { PinnedItems } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import { Button, Icon } from '@wordpress/components';
import { arrowLeft } from '@wordpress/icons';
import HeaderToolbar from './header-toolbar';
import MoreMenu from './more-menu';
import SaveButton from './save-button';

const goBack = () => {
	window.location = iconvertemRichText.campaign_url;
};

const BackButton = () => {
	return (
		<Button
			onClick={goBack}
			isPressed
			className="iconvertem-template-editor-back-button"
		>
			<Icon icon={arrowLeft} size={32} />
		</Button>
	);
};

function Header() {
	const isLargeViewport = useViewportMatch('large');

	const classes = classnames('edit-post-header');

	return (
		<div className={classes}>
			<BackButton />
			<div className="edit-post-header__toolbar">
				<HeaderToolbar />
			</div>
			<div className="edit-post-header__settings">
				<SaveButton />
				{isLargeViewport && (
					<>
						<PinnedItems.Slot scope="ic/edit-mail" />
						<MoreMenu />
					</>
				)}
				{!isLargeViewport && <MoreMenu />}
			</div>
		</div>
	);
}

export default Header;
