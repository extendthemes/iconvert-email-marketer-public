//

import { BlockControls } from '@wordpress/block-editor';
import { Dropdown, ToolbarButton, ToolbarGroup } from '@wordpress/components';

import { TypographyControl } from '@kubio/controls';

// Necessary for correct load order allowing to override Bold control.
import { useMemo, useState } from '@wordpress/element';
import '@wordpress/format-library';
import { next, textColor, typography } from '@wordpress/icons';

import {
	applyFormat,
	getActiveFormat,
	removeFormat,
	registerFormatType,
} from '@wordpress/rich-text';
import { HorizontalTextAlign } from '../../components/common/utility/controls/align';
import { __ } from '@wordpress/i18n';

const fontFormat = `extendstudio/typography`;

export const transparentValue = 'rgba(0, 0, 0, 0)';

function getComputedStyleProperty( element, property ) {
	const { ownerDocument } = element;
	const { defaultView } = ownerDocument;
	const style = defaultView.getComputedStyle( element );
	const value = style.getPropertyValue( property );

	if ( property === 'font-family' ) {
		let nextValue = value.split( ',' )[ 0 ];
		nextValue = nextValue.replace( /"|'/gim, '' );
		return nextValue;
	}

	if (
		property === 'background-color' &&
		value === transparentValue &&
		element.parentElement
	) {
		return getComputedStyleProperty( element.parentElement, property );
	}

	return value;
}

const stringtoUnitValueObject = ( value ) => {
	const numberValue = ( value || '' ).replace( /em|rem|px|%|vw|vh/, '' );
	const unit = value.replace( numberValue, '' );

	return {
		value: numberValue,
		unit,
	};
};

const propsMap = {
	color: 'color',
	family: 'font-family',
	weight: 'font-weight',
	size: 'font-size',
	transform: 'text-transform',
	style: 'font-style',
	lineHeight: 'line-height',
	textAlign: 'text-align',
};

const TypographyEdit = ( {
	value,
	onChange,
	isActive,
	activeAttributes,
	contentRef,
} ) => {
	const [ currentValue, setCurrentValue ] = useState( {} );

	const onTypoChange = ( nextValue ) => {
		if ( ! nextValue ) {
			return;
		}

		setCurrentValue( nextValue );
		// let newValue = value;
		const linkFormat = getActiveFormat( value, 'core/link' );
		if ( linkFormat ) {
			delete linkFormat.attributes.style;
		}

		const style = [];
		const props = Object.keys( propsMap );

		if ( nextValue.textAlign ) {
			props.push( 'textAlign' );
			props.push( 'display' );
		}

		props.forEach( ( key ) => {
			const propValue = nextValue[ key ];

			if ( key === 'display' ) {
				style.push( `display:${ propValue }` );
			}

			if ( key === 'textAlign' ) {
				style.push( `text-align:${ propValue }` );
				return;
			}

			if ( [ 'size', 'lineHeight' ].includes( key ) ) {
				style.push(
					`${ propsMap[ key ] }:${ propValue.value }${ propValue.unit }`
				);
			} else {
				style.push( `${ propsMap[ key ] }:${ propValue }` );
			}
		} );

		const styleText = style.join( ';' );

		onChange(
			applyFormat( value, {
				type: fontFormat,
				attributes: {
					style: styleText,
				},
			} )
		);

		if ( linkFormat ) {
			linkFormat.attributes = {
				...linkFormat.attributes,
				style: `color: ${ nextValue.color }; text-decoration-color: ${ nextValue.color }`,
			};
			nextValue = removeFormat(
				value,
				'core/link',
				value.start,
				value.end
			);
			onChange( applyFormat( nextValue, linkFormat ) );
		}
	};

	const mappedValue = useMemo( () => {
		const result = {};

		const format = getActiveFormat( value, fontFormat );
		let el = contentRef.current;

		if ( format ) {
			el = document.createElement( 'span' );
			document.body.appendChild( el );
			el.style = format.attributes.style;
		}

		const props = Object.keys( propsMap );

		if ( format && format.attributes.style?.includes( 'text-align' ) ) {
			props.push( 'textAlign' );
			props.push( 'display' );
		}

		props.forEach( ( key ) => {
			if ( key === 'display' ) {
				result.display = getComputedStyleProperty( el, 'display' );
				return;
			}

			if ( key === 'textAlign' ) {
				result.display = getComputedStyleProperty( el, 'text-align' );
				return;
			}

			if ( [ 'size', 'lineHeight' ].includes( key ) ) {
				result[ key ] = stringtoUnitValueObject(
					getComputedStyleProperty( el, propsMap[ key ] )
				);
			} else {
				result[ key ] = getComputedStyleProperty( el, propsMap[ key ] );
			}
		} );

		if ( format ) {
			el.remove();
		}

		result.lineHeight.value = result.lineHeight.value / result.size.value;
		result.lineHeight.unit = '';

		return result;
	}, [ value, contentRef.current ] );

	return (
		<BlockControls>
			<ToolbarGroup className="block-editor-block-toolbar__block-controls extend-format-controls">
				<Dropdown
					renderContent={ () => (
						<div style={ { width: '280px', minHeight: '340px' } }>
							<>
								<TypographyControl
									withColor
									value={ currentValue }
									onChange={ onTypoChange }
									withDecoration={ false }
									withLetterSpacing={ false }
								/>
								<HorizontalTextAlign
									label={ __(
										'Text align',
										'iconvert-email-marketer'
									) }
									value={ currentValue.textAlign }
									skipJustify={ true }
									onChange={ ( nextValue ) => {
										if (
											nextValue !== currentValue.textAlign
										) {
											onTypoChange( {
												...currentValue,
												textAlign: nextValue,
												display: 'block',
											} );
										}
									} }
								/>
							</>
						</div>
					) }
					renderToggle={ ( { isOpen, onToggle } ) => (
						<ToolbarButton
							isOpen={ isOpen }
							onClick={ () => {
								onToggle();
								if ( ! isOpen ) {
									setCurrentValue( mappedValue );
								}
							} }
							icon={ typography }
						/>
					) }
				/>
			</ToolbarGroup>
		</BlockControls>
	);
};

registerFormatType( fontFormat, {
	title: `Typography`,
	tagName: 'span',
	className: `extendstudio-typography`,
	attributes: {
		style: 'style',
	},
	edit: TypographyEdit,
} );
