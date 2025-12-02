import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import PopoverOptionsButton from '../popover-options-button';
import TypographyControl from './control';

const TypographyControlPopup = ( props ) => {
	const { label = __( 'Typography', 'iconvert-email-marketer' ), onReset = _.noop } =
		props;

	function onLocalReset( localPath, localOptions ) {
		const localOptionsColor = { ignoredPathOnUnset: 'color' };
		localOptions = _.merge( localOptions, localOptionsColor );

		onReset( localPath, localOptions );
	}

	return (
		<>
			<PopoverOptionsButton
				label={ label }
				popoverWidth={ 250 }
				showReset
				onReset={ onLocalReset }
				popupContent={ <TypographyControl hideReset { ...props } /> }
			/>
		</>
	);
};
export { TypographyControlPopup, TypographyControl };
export default TypographyControlPopup;
