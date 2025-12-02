import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	KubioPanelBody,
	InputControl,
	ToggleControl,
	UnitControl,
} from '@kubio/controls';

const Properties = ( props ) => {
	const { attributes, setAttributes } = props;
	const { link, _style } = attributes;
	const { width } = _style;

	const [ widthAutoEnabled, setWidthAutoEnabled ] = useState(
		width === 'auto' || ! width
	);

	const setStyle = ( path ) => ( newValue ) => {
		const payload = {
			..._style,
			[ path ]: newValue,
		};
		setAttributes( { _style: payload } );
	};
	const handleFormCheckAuto = ( value ) => {
		if ( value ) {
			setStyle( 'width' )( 'auto' );
		} else {
			setStyle( 'width' )( '' );
		}
		setWidthAutoEnabled( value );
	};

	const onWidthChange = ( newVal ) => {
		let { value, unit } = newVal;

		if ( ! unit ) {
			unit = 'px';
		}

		setStyle( 'width' )( value + unit );
	};

	return (
		<KubioPanelBody
			title={ __( 'Properties', 'iconvert-email-marketer' ) }
			initialOpen={ true }
		>
			<InputControl
				label={ __( 'Link', 'iconvert-email-marketer' ) }
				value={ link }
				onChange={ ( value ) => setAttributes( { link: value } ) }
			/>
			<ToggleControl
				label={ 'Width auto' }
				value={ widthAutoEnabled }
				onChange={ ( state ) => handleFormCheckAuto( state ) }
			/>
			{ ! widthAutoEnabled && (
				<UnitControl
					label={ __( 'Width', 'iconvert-email-marketer' ) }
					labelPosition="edge"
					value={ width || '' }
					onChange={ onWidthChange }
				/>
			) }
		</KubioPanelBody>
	);
};

export { Properties };
