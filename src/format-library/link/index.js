import {
	applyFormat,
	registerFormatType,
	getActiveFormat,
	unregisterFormatType,
} from '@wordpress/rich-text';

// Necessary for correct load order allowing to override Link control.
import '@wordpress/format-library';

const { name: linkFormatName, edit: Edit, ...link } = unregisterFormatType( 'core/link' );

const textColorFormatName = `extendstudio/text-color`;

const LinkEdit = ( props ) => {
	const {isActive, value, onChange } = props;

	const getLinkFormat = (richText) => {
		const { formats = [], start = -1 } = richText;

		if(start < 0 || formats.length <= 0) return {};

		return formats[start-1].find(el => el.type === 'core/link');
	}

	const linkChanged = (prev, current) => {
		if(!prev && !current) return false;

		return prev?.attributes?.target !== current?.attributes?.target ||
			prev?.attributes?.url !== current?.attributes?.url;
	}

	const onChangeLink = (formValue) => {
		let newValue = formValue;
		const textColorFormat = getActiveFormat(value, textColorFormatName);

		if(textColorFormat ) {
			let linkFormat = getLinkFormat(newValue);
			const prevLinkFormat = getActiveFormat(value, linkFormatName);

			if( linkFormat && (!isActive || linkChanged(prevLinkFormat, linkFormat)) ){
				linkFormat = {
					...linkFormat,
					attributes: {
						...linkFormat.attributes,
						style: textColorFormat.attributes.style
					}
				}

				onChange(applyFormat(newValue, linkFormat, value.start, value.end))
			}else{
				onChange(newValue)
			}
		}else{
			onChange(newValue)
		}
	}

	return (
		<Edit {...{...props, onChange: onChangeLink}}/>
	);
};

registerFormatType( linkFormatName, {
	...link,
	attributes:{
		...link.attributes,
		style: 'style'
	},
	edit: LinkEdit,
} );
