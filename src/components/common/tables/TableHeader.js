import styleParser from '@iconvertem/components/common/utility/styleParser.js';

const TableHeader = (props) => {
	const { labels, _element, _cellElement = 'TableCell', attributes } = props;

	const _style = attributes[`_style${_element}`] || {};
	const _styleCell = attributes[`_style${_cellElement}`] || {};

	return (
		<thead>
			<tr
				style={{
					width: '100%',

					...styleParser(_style),
				}}
			>
				{labels.map((element, index) => (
					<th style={{ ...styleParser(_styleCell) }} key={index}>
						{element}
					</th>
				))}
			</tr>
		</thead>
	);
};

export default TableHeader;
