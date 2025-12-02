/**
 * External dependencies
 */
import { omit } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { createBlock } = wp.blocks;
const { InnerBlocks, getColorClassName } = wp.blockEditor;

/**
 * Given an HTML string for a deprecated columns inner block, returns the
 * column index to which the migrated inner block should be assigned. Returns
 * undefined if the inner block was not assigned to a column.
 *
 * @param {string} originalContent Deprecated Columns inner block HTML.
 *
 * @return {?number} Column to which inner block is to be assigned.
 */
function getDeprecatedLayoutColumn(originalContent) {
	let { doc } = getDeprecatedLayoutColumn;
	if (!doc) {
		doc = document.implementation.createHTMLDocument('');
		getDeprecatedLayoutColumn.doc = doc;
	}

	let columnMatch;

	doc.body.innerHTML = originalContent;
	for (const classListItem of doc.body.firstChild.classList) {
		if (
			(columnMatch = classListItem.match(/^layout-column-(\d+)$/))
		) {
			return Number(columnMatch[1]) - 1;
		}
	}
}

const migrateCustomColors = (attributes) => {
	if (!attributes.customTextColor && !attributes.customBackgroundColor) {
		return attributes;
	}
	const style = { color: {} };
	if (attributes.customTextColor) {
		style.color.text = attributes.customTextColor;
	}
	if (attributes.customBackgroundColor) {
		style.color.background = attributes.customBackgroundColor;
	}
	return {
		...omit(attributes, ['customTextColor', 'customBackgroundColor']),
		style,
		isStackedOnMobile: true,
	};
};

export default [
	{
		attributes: {
			verticalAlignment: {
				type: 'string',
			},
			backgroundColor: {
				type: 'string',
			},
			customBackgroundColor: {
				type: 'string',
			},
			customTextColor: {
				type: 'string',
			},
			textColor: {
				type: 'string',
			},
		},
		migrate: migrateCustomColors,
		save({ attributes }) {
			const {
				verticalAlignment,
				backgroundColor,
				customBackgroundColor,
				textColor,
				customTextColor,
			} = attributes;

			const backgroundClass = getColorClassName(
				'background-color',
				backgroundColor
			);

			const textClass = getColorClassName('color', textColor);

			const className = classnames({
				'has-background': backgroundColor || customBackgroundColor,
				'has-text-color': textColor || customTextColor,
				[backgroundClass]: backgroundClass,
				[textClass]: textClass,
				[`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
			});

			const style = {
				backgroundColor: backgroundClass
					? undefined
					: customBackgroundColor,
				color: textClass ? undefined : customTextColor,
			};

			return (
				<table
					className={className ? className : undefined}
					style={style}
				>
					<tr>
						<td>
							<InnerBlocks.Content/>
						</td>
					</tr>
				</table>
			);
		},
	},
	{
		attributes: {
			columns: {
				type: 'number',
				default: 2,
			},
		},
		isEligible(attributes, innerBlocks) {
			// Since isEligible is called on every valid instance of the
			// Columns block and a deprecation is the unlikely case due to
			// its subsequent migration, optimize for the `false` condition
			// by performing a naive, inaccurate pass at inner blocks.
			const isFastPassEligible = innerBlocks.some((innerBlock) =>
				/layout-column-\d+/.test(innerBlock.originalContent)
			);

			if (!isFastPassEligible) {
				return false;
			}

			// Only if the fast pass is considered eligible is the more
			// accurate, durable, slower condition performed.
			return innerBlocks.some(
				(innerBlock) =>
					getDeprecatedLayoutColumn(innerBlock.originalContent) !==
					undefined
			);
		},
		migrate(attributes, innerBlocks) {
			const columns = innerBlocks.reduce((accumulator, innerBlock) => {
				const { originalContent } = innerBlock;

				let columnIndex = getDeprecatedLayoutColumn(originalContent);
				if (columnIndex === undefined) {
					columnIndex = 0;
				}

				if (!accumulator[columnIndex]) {
					accumulator[columnIndex] = [];
				}

				accumulator[columnIndex].push(innerBlock);

				return accumulator;
			}, []);

			const migratedInnerBlocks = columns.map((cellBlocks) =>
				createBlock('extendstudio/cell', {}, cellBlocks)
			);

			return [
				{
					...omit(attributes, ['columns']),
					isStackedOnMobile: true,
				},
				migratedInnerBlocks,
			];
		},
		save({ attributes }) {
			const { columns } = attributes;

			return (
				<table className={`has-${columns}-columns`}>
					<tr>
						<td>
							<InnerBlocks.Content/>
						</td>
					</tr>
				</table>
			);
		},
	},
	{
		attributes: {
			columns: {
				type: 'number',
				default: 2,
			},
		},
		migrate(attributes, innerBlocks) {
			attributes = {
				...omit(attributes, ['columns']),
				isStackedOnMobile: true,
			};

			return [attributes, innerBlocks];
		},
		save({ attributes }) {
			const { verticalAlignment, columns } = attributes;

			const wrapperClasses = classnames(`has-${columns}-columns`, {
				[`are-vertically-aligned-${verticalAlignment}`]: verticalAlignment,
			});

			return (
				<table className={wrapperClasses}>
					<tr>
						<td>
							<InnerBlocks.Content/>
						</td>
					</tr>
				</table>
			);
		},
	},
];
