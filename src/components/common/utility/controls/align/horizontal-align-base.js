import { ToggleGroup } from '@kubio/controls';
import { __ } from '@wordpress/i18n';
import { horizontalAlignOptions } from '../ui-utils';

const HorizontalAlignBase = ( props ) => {
	// eslint-disable-next-line no-unused-vars
	const { styledComponent, ...rest } = props;

	return (
		<ToggleGroup
			className={ 'kubio-horizontal' }
			label={ __( 'Horizontal align', 'iconvert-email-marketer' ) }
			options={ horizontalAlignOptions }
			allowReset
			{ ...rest }
		/>
	);
};

export { HorizontalAlignBase };
