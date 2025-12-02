import {
	colorRegex,
	urlRegex,
} from '@iconvertem/components/common/utility/functions.js';
import _ from 'lodash';

export default function styleParser( _style = {}, _element = false ) {
	let result = {};
	if ( _element !== false ) {
		const elem = _.pick( _style, [ _element ] );
		result = { ...elem[ _element ] };
	} else {
		result = { ..._style };
	}

	if ( typeof result.padding === 'object' ) {
		result.padding =
			fixStructureUnitControl( result.padding.top ) +
			' ' +
			fixStructureUnitControl( result.padding.right ) +
			' ' +
			fixStructureUnitControl( result.padding.bottom ) +
			' ' +
			fixStructureUnitControl( result.padding.left );
	}
	if ( typeof result.margin === 'object' ) {
		result.margin =
			fixStructureUnitControl( result.margin.top ) +
			' ' +
			fixStructureUnitControl( result.margin.right ) +
			' ' +
			fixStructureUnitControl( result.margin.bottom ) +
			' ' +
			fixStructureUnitControl( result.margin.left );
	}
	if ( typeof result.border === 'object' ) {
		result.borderTop = result.border.top
			? `${ _.get( result, 'border.top.width.value' ) }${
					_.get( result, 'border.top.width.unit' ) || 'px'
			  } ${ _.get( result, 'border.top.style' ) }  ${ _.get(
					result,
					'border.top.color'
			  ) }`
			: undefined;
		result.borderBottom = result.border.bottom
			? `${ _.get( result, 'border.bottom.width.value' ) }${
					_.get( result, 'border.bottom.width.unit' ) || 'px'
			  } ${ _.get( result, 'border.bottom.style' ) }  ${ _.get(
					result,
					'border.bottom.color'
			  ) }`
			: undefined;
		result.borderLeft = result.border.left
			? `${ _.get( result, 'border.left.width.value' ) }${
					_.get( result, 'border.left.width.unit' ) || 'px'
			  } ${ _.get( result, 'border.left.style' ) }  ${ _.get(
					result,
					'border.left.color'
			  ) }`
			: undefined;
		result.borderRight = result.border.right
			? `${ _.get( result, 'border.right.width.value' ) }${
					_.get( result, 'border.right.width.unit' ) || 'px'
			  } ${ _.get( result, 'border.right.style' ) }  ${ _.get(
					result,
					'border.right.color'
			  ) }`
			: undefined;

		result.border = undefined;
	}
	if ( typeof result.borderRadius === 'object' ) {
		result.borderTopLeftRadius = `${ _.get(
			result,
			'borderRadius.top.value'
		) }${ _.get( result, 'borderRadius.top.unit' ) }`;
		result.borderTopRightRadius = `${ _.get(
			result,
			'borderRadius.right.value'
		) }${ _.get( result, 'borderRadius.right.unit' ) }`;
		result.borderBottomLeftRadius = `${ _.get(
			result,
			'borderRadius.left.value'
		) }${ _.get( result, 'borderRadius.left.unit' ) }`;
		result.borderBottomRightRadius = `${ _.get(
			result,
			'borderRadius.bottom.value'
		) }${ _.get( result, 'borderRadius.bottom.unit' ) }`;
		result.borderRadius = undefined;
	}

	if ( typeof result.typography === 'object' ) {
		result.fontFamily = _.isNull( _.get( result, 'typography.family' ) )
			? undefined
			: _.get( result, 'typography.family' );
		result.fontWeight = _.isNull( _.get( result, 'typography.weight' ) )
			? undefined
			: _.get( result, 'typography.weight' );
		result.fontStyle = _.isNull( _.get( result, 'typography.style' ) )
			? undefined
			: _.get( result, 'typography.style' );
		result.fontSize = _.isNull( _.get( result, 'typography.size.value' ) )
			? undefined
			: `${ _.get( result, 'typography.size.value' ) }${ _.get(
					result,
					'typography.size.unit'
			  ) }`;
		result.textTransform = _.isNull(
			_.get( result, 'typography.transform' )
		)
			? undefined
			: _.get( result, 'typography.transform' );
		result.textDecoration = _.isNull(
			_.get( result, 'typography.decoration' )
		)
			? undefined
			: _.get( result, 'typography.decoration' );
		result.lineHeight = _.isNull(
			_.get( result, 'typography.lineHeight.value' )
		)
			? undefined
			: `${ _.get( result, 'typography.lineHeight.value' ) }${ _.get(
					result,
					'typography.lineHeight.unit'
			  ) }`;
		result.letterSpacing = _.isNull(
			_.get( result, 'typography.letterSpacing.value' )
		)
			? undefined
			: `${ _.get( result, 'typography.letterSpacing.value' ) }${ _.get(
					result,
					'typography.letterSpacing.unit'
			  ) }`;
		result.color = _.isNull( _.get( result, 'typography.color' ) )
			? undefined
			: _.get( result, 'typography.color' );
		result.typography = undefined;
	}
	if ( typeof result.width === 'object' ) {
		result.width = `${ result.width.value }${ result.width.unit }`;
	}
	if ( result.background ) {
		result.backgroundColor = result.background;
	}

	if ( result.backgroundImage ) {
		result.backgroundRepeat = 'no-repeat';
		result.backgroundSize = 'cover';
		result.backgroundPosition = 'center';
		result.backgroundImage = `url("${ result.backgroundImage }")`;
	}

	return result;
}

function fixStructureUnitControl( unitStructure ) {
	if ( typeof unitStructure === 'object' ) {
		return unitStructure.value + unitStructure.unit;
	}

	return unitStructure;
}
