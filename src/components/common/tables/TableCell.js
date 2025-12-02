import styleParser from '../../../components/common/utility/styleParser.js';

const TableCell = (props) => {
	const { children: innerContent, dangerouslySetInnerHTML = false } = props;
	const {
		_element = 'TableCell',
		attributes,
		colSpan = 1,
		width = 'auto',
	} = props;

	const _style = attributes[`_style${_element}`] || {};
	return (
		<>
			{innerContent && (
				<td
					colSpan={colSpan}
					style={{
						width,

						verticalAlign: 'top',
						...styleParser(_style),
					}}
				>
					{innerContent}
				</td>
			)}
			{dangerouslySetInnerHTML !== false && (
				<td
					colSpan={colSpan}
					style={{
						width,

						...styleParser(_style),
					}}
					dangerouslySetInnerHTML={{
						__html: props.dangerouslySetInnerHTML.__html,
					}}
				/>
			)}
		</>
	);
};

export default TableCell;
