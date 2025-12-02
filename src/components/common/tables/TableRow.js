import TableCell from "./TableCell";

const TableData = (props) => {
    const {_cellData = [], colSpan = 1} = props;    
    return (
        <>
            {_cellData && _cellData.map((data, index) => <TableCell colSpan={colSpan} {...props} key={index} dangerouslySetInnerHTML={{ __html: data }} />)} 
        </>
    );
}

const TableRow = (props) => {
    const {_cellData = [], colSpan = 1, _noCellWrap = false, _cellElement = 'TableCell', children: innerContent} = props;    
    
    return (
        <tr>
            {_cellData.length > 0 && <TableData {...props} _cellData={_cellData} />}
            {(_cellData.length === 0 && _noCellWrap === false) && <TableCell {...props} _element={_cellElement} colSpan={colSpan}>{innerContent}</TableCell>}
            {_noCellWrap === true && innerContent}
        </tr>
    )

}

export default TableRow;
