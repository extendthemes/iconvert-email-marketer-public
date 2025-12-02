import styleParser from '@iconvertem/components/common/utility/styleParser.js';

const Table = (props) => {
	const {
		_element,
		attributes,
		children: innerContent,
		blockProps = {},
	} = props;

	const _style = attributes[`_style${_element}`] || {};

	return (
		<table
			{...blockProps}
			style={{
				width: '100%',

				...styleParser(_style),
			}}
			border="0"
			cellPadding="0"
			cellSpacing="0"
			role="presentation"
			width="100%"
		>
			{innerContent}
		</table>
	);
};

export default Table;
