import { useMemo, useRef, useState } from '@wordpress/element';
import { List } from 'react-virtualized';
import { loadGoogleFonts } from '@kubio/utils';
import { BaseControl } from '@wordpress/components';
import filterFonts from './filter-fonts';
import FontListItem from './font-list-item';
import { FontSearch } from './font-search';
import googleFonts from './google-fonts';
import { useBlocksOwnerDocument } from '../../../../utils/hooks/context';

const getAvailableGoogleFonts = () =>
	googleFonts.map((item) => ({ ...item, fontType: 'google' }));

const FontsList = ({
	value,
	onChange,
	displayFonts = 10,
	fontItemHeight = 30,
}) => {
	const [search, setSearch] = useState('');

	const document = useBlocksOwnerDocument();
	const { getGoogleFonts = () => [], addGoogleFont = () => [] } = {};
	const usedFonts = getGoogleFonts();
	const notUsedFonts = useMemo(() => {
		const usedFamilies = usedFonts.map((font) => font.family);

		return getAvailableGoogleFonts().filter(
			(font) => usedFamilies.indexOf(font.family) === -1
		);
	}, [usedFonts]);

	const filteredUsedFonts = useMemo(
		() => filterFonts(usedFonts, search),
		[search, usedFonts]
	);

	const filteredNotUsedFonts = useMemo(
		() => filterFonts(notUsedFonts, search),
		[search, notUsedFonts]
	);

	const finalList = useMemo(() => {
		return [].concat(
			filteredUsedFonts,
			filteredUsedFonts.length ? [{ separator: true }] : [], // add separator only if the are usedFonts

			filteredNotUsedFonts
		);
	}, [filteredUsedFonts, filteredNotUsedFonts]);

	const onFontClicked = ({ family, variants, fontType }) => {
		loadGoogleFonts([{ family, variants }], document);
		if (fontType === 'google') {
			addGoogleFont({ family, variants });
		}

		onChange(family);
	};

	const pastSeparator = useRef(false);
	const renderRow = (props) => {
		if (props.index === 0) {
			pastSeparator.current = false;
		}
		const item = finalList[props.index];
		const isSelected = item.family === value;
		if (item.separator && !pastSeparator.current) {
			pastSeparator.current = true;
		}
		return (
			<FontListItem
				key={props.index}
				{...props}
				item={item}
				isSelected={isSelected}
				onClick={onFontClicked}
				load={loadGoogleFonts}
				pastSeparator={pastSeparator.current}
				isScrolling={props.isScrolling}
				isVisible={props.isVisible}
			/>
		);
	};

	return (
		<BaseControl>
			<FontSearch value={search} onChange={setSearch} />

			<List
				width={250}
				rowHeight={fontItemHeight}
				rowCount={finalList.length}
				rowRenderer={renderRow}
				height={displayFonts * fontItemHeight}
			/>
		</BaseControl>
	);
};

export { FontsList };
