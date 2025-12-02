import { Flex, FlexBlock, FlexItem } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _, { cloneDeep, set } from 'lodash';
import {
	ColorIndicatorPopover,
	FontPicker,
	GutentagSelectControl,
	RangeWithUnitControl,
} from '../../components';
import {
	decorationOptions,
	sizeOptions,
	sizeUnitsOptions,
	styleOptions,
	transformOptions,
	weightOptions,
} from './config';

const TypographyControl = ( props ) => {
	// const { getFontWeights } = useGlobalDataFonts();
	const {
		onChange = _.noop,
		onReset = _.noop,
		value: currentValue,
		withFamily = true,
		withWeight = true,
		withColor = false,
		withSize = true,
		withTransform = true,
		withStyle = true,
		withDecoration = true,
		withLineHeight = true,
		withLetterSpacing = true,
		hideReset = false,
	} = props;

	let { family, weight } = currentValue;
	weight = Number( weight );
	const onPropChange = ( path ) => ( newValue ) => {
		const changes = set( cloneDeep( currentValue ), path, newValue );
		onChange( changes );
	};

	const onResetValue = ( path ) => () => {
		onReset( path );
	};

	const getValue = ( path ) => {
		return _.get( currentValue, path );
	};

	const getData = ( path, fallback = '' ) => {
		return {
			value: getValue( path, fallback ),
			onChange: onPropChange( path ),
			onReset: onResetValue( path ),
		};
	};

	const fontWeightProps = getData( 'weight' );
	fontWeightProps.value = parseInt( fontWeightProps.value );

	const currentWeights = [ 100, 200, 300, 400, 500, 600, 700, 800, 900 ]; // getFontWeights(getValue('family'));
	const currentWeightsOptions = weightOptions.filter(
		( { value } ) => currentWeights.indexOf( value ) !== -1
	);

	// When we try to set a font weight that doesn't exists, stick to default.
	useEffect( () => {
		if ( parseInt( weight ) === 400 ) {
			return;
		}

		const checkIfWeightExists = currentWeightsOptions.find( ( i ) => {
			return i.value === parseInt( fontWeightProps.value );
		} );

		if ( ! checkIfWeightExists ) {
			onPropChange( 'weight' )( 400 );
		}
	}, [ weight, family ] );

	return (
		<>
			{ withFamily && (
				<Flex className="kubio-font-family-container">
					<FlexBlock>
						<span className={ 'kubio-font-family-label' }>
							{ __( 'Font family', 'iconvert-email-marketer' ) }
						</span>
					</FlexBlock>
					<FlexItem>
						<FontPicker { ...getData( 'family' ) } />
					</FlexItem>
				</Flex>
			) }

			{ withWeight && (
				<GutentagSelectControl
					label={ __( 'Weight', 'iconvert-email-marketer' ) }
					className={ 'kubio-select-control-container' }
					{ ...fontWeightProps }
					options={ currentWeightsOptions }
				/>
			) }

			{ withColor && (
				<ColorIndicatorPopover
					showReset={ ! hideReset }
					label={ __( 'Color', 'iconvert-email-marketer' ) }
					alpha={ true }
					{ ...getData( 'color' ) }
				/>
			) }

			{ withSize && (
				<RangeWithUnitControl
					{ ...getData( 'size' ) }
					label={ __( 'Size', 'iconvert-email-marketer' ) }
					{ ...sizeOptions }
					allowReset={ ! hideReset }
				/>
			) }

			{ withTransform && (
				<GutentagSelectControl
					label={ __( 'Transform', 'iconvert-email-marketer' ) }
					className={ 'kubio-select-control-container' }
					{ ...getData( 'transform' ) }
					options={ transformOptions }
				/>
			) }

			{ withStyle && (
				<GutentagSelectControl
					label={ __( 'Style', 'iconvert-email-marketer' ) }
					className={ 'kubio-select-control-container' }
					{ ...getData( 'style' ) }
					options={ styleOptions }
				/>
			) }

			{ withDecoration && (
				<GutentagSelectControl
					label={ __( 'Decoration', 'iconvert-email-marketer' ) }
					className={ 'kubio-select-control-container' }
					{ ...getData( 'decoration' ) }
					options={ decorationOptions }
				/>
			) }

			{ withLineHeight && (
				<RangeWithUnitControl
					label={ __( 'Line height', 'iconvert-email-marketer' ) }
					{ ...getData( 'lineHeight' ) }
					units={ [ '' ] }
					defaultUnit={ '' }
					min={ 0 }
					max={ 10 }
					step={ 0.1 }
					allowReset={ ! hideReset }
				/>
			) }

			{ withLetterSpacing && (
				<RangeWithUnitControl
					label={ __( 'Letter spacing', 'iconvert-email-marketer' ) }
					{ ...getData( 'letterSpacing' ) }
					units={ sizeUnitsOptions }
					min={ 0 }
					max={ 10 }
					allowReset={ ! hideReset }
				/>
			) }
		</>
	);
};

export default TypographyControl;
