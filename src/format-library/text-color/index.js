import {
	applyFormat,
	removeFormat,
	registerFormatType,
	getActiveFormat,
} from '@wordpress/rich-text';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { ColorIndicatorPopover} from '@kubio/controls';

// Necessary for correct load order allowing to override Bold control.
import '@wordpress/format-library';

const textColorFormatName = `extendstudio/text-color`;

const TextColorEdit = ( { value, onChange } ) => {
	const onColorChange = (pickerColor) => {
		if(!value) return;

		let newValue = value;
		const linkFormat = getActiveFormat(value, 'core/link');

		// On reset
		if( typeof pickerColor !== 'string' ){
			onChange(removeFormat(value, textColorFormatName, value.start, value.end))

			if( linkFormat ){
				delete linkFormat.attributes.style;
			}

			return;
		}

		onChange(
			applyFormat( newValue, {
				type: textColorFormatName,
				attributes: {
					style: `color: ${ pickerColor }; text-decoration-color: ${pickerColor}`,
				},
			} )
		)

		if( linkFormat ){
			linkFormat.attributes = {...linkFormat.attributes, style: `color: ${ pickerColor }; text-decoration-color: ${pickerColor}`}

			newValue = removeFormat(value, 'core/link', value.start, value.end);
			onChange( applyFormat(newValue, linkFormat) );
		}
	}

	return (
		<BlockControls>
			<ToolbarGroup className="block-editor-block-toolbar__block-controls extend-format-controls">
				<ToolbarButton
					icon={(
						<ColorIndicatorPopover
							value={"#555"}
							onChange={onColorChange}
							hasButton={true}
						/>)}
					title={ `Text Color` }
				/>
			</ToolbarGroup>
		</BlockControls>
	);
};

registerFormatType( textColorFormatName, {
	title: `Text Color`,
	tagName: 'span',
	className: `extendstudio-text-color`,
	attributes: {
		style: 'style'
	},
	edit: TextColorEdit,
} );
