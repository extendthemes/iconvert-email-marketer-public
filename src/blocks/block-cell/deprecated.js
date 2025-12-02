/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { InnerBlocks } = wp.blockEditor;

const deprecated = [
	{
		attributes: {
			verticalAlignment: {
				type: 'string',
			},
			width: {
				type: 'number',
				min: 0,
				max: 100,
			},
		},
		isEligible( { width } ) {
			return isFinite( width );
		},
		migrate( attributes ) {
			return {
				...attributes,
				width: `${ attributes.width }%`,
			};
		},
		save( { attributes } ) {
			const { verticalAlignment, width } = attributes;

			const wrapperClasses = classnames( {
				[ `is-vertically-aligned-${ verticalAlignment }` ]: verticalAlignment,
			} );

			const style = { width: width + '%' };

			return (
				<div className={ wrapperClasses } style={ style }>
					<InnerBlocks.Content />
				</div>
			);
		},
	},
];

export default deprecated;
