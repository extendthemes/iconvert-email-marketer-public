import styleParser from '@iconvertem/components/common/utility/styleParser.js';

const TableFooter = ( props ) => {
	const {
		_element = 'TableFooter',
		attributes,
		children: innerContent,
	} = props;

	const _style = attributes[ `_style${ _element }` ] || {};

	return (
		<tfoot style={ { ...styleParser( _style ) } }>{ innerContent }</tfoot>
	);
};
export default TableFooter;
