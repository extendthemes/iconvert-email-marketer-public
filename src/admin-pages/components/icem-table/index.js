import { IcemTablePagination } from './icem-table-pagination';

const IcemTable = ({ children, className = '', ...props }) => (
	<table className={`icem-table ${className}`} {...props}>
		{children}
	</table>
);

IcemTable.Thead = ({ children, className = '', ...props }) => (
	<thead className={`icem-table__head ${className}`} {...props}>
		{children}
	</thead>
);

IcemTable.Tbody = ({ children, className = '', ...props }) => (
	<tbody className={`icem-table__body ${className}`} {...props}>
		{children}
	</tbody>
);

IcemTable.Tr = ({ children, className = '', ...props }) => (
	<tr className={`icem-table__tr ${className}`} {...props}>
		{children}
	</tr>
);

IcemTable.Th = ({ children, className = '', ...props }) => (
	<th className={`icem-table__th ${className}`} {...props}>
		{children}
	</th>
);

IcemTable.Td = ({ children, className = '', ...props }) => (
	<td className={`icem-table__td ${className}`} {...props}>
		{children}
	</td>
);

IcemTable.Pagination = IcemTablePagination;

export { IcemTable };
