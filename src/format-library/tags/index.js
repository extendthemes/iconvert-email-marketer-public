import { registerFormatType, insert, create } from '@wordpress/rich-text';
import { BlockControls } from '@wordpress/block-editor';
import { Toolbar, Dropdown, Button } from '@wordpress/components';
import { plusCircle, Icon } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';
// Necessary for correct load order allowing to override Bold control.
import '@wordpress/format-library';

const tagsFormatName = `iconvert/wc-tags`;
const TagEdit = (props) => {
	const { value, onChange } = props;
	const tagsList = useSelect((select) => {
		const { wc_tags_list: wcTagsList } =
			select('core/block-editor').getSettings();
		return wcTagsList || {};
	}, []);

	const onItemClick = (tagToInsert) => {
		const valueToInsert = create({
			html: `&nbsp;<span class="ic-mail-wc-tag" contentEditable="false" readonly="true" UNSELECTABLE="ON">${tagToInsert}</span>&nbsp;`,
		});

		onChange(insert(value, valueToInsert));
	};
	const controlsTag = Object.keys(tagsList).map((item) => {
		if (typeof tagsList[item] === 'object') {
			const childrenDataObject = Object.assign({}, tagsList[item].values);

			return {
				title: tagsList[item].label,
				children: Object.keys(childrenDataObject).map((childItem) => ({
					title: childrenDataObject[childItem],
					value: childItem,
				})),
			};
		}
		return {
			title: tagsList[item],
			value: item,
		};
	});
	const dropdownRender = () => {
		return controlsTag.map((tagItem, indexTagItem) => {
			if (typeof tagItem.children !== 'undefined') {
				return (
					<Dropdown
						className={''}
						key={indexTagItem}
						contentClassName="popover-content-tags"
						popoverProps={{ placement: 'right-start' }}
						renderToggle={({ isOpen, onToggle }) => (
							<Button onClick={onToggle} aria-expanded={isOpen}>
								{tagItem.title}
							</Button>
						)}
						renderContent={() => {
							return tagItem.children.map(
								(subTagItem, indexSubTagItem) => {
									return (
										<Button
											key={indexSubTagItem}
											onClick={() =>
												onItemClick(subTagItem.value)
											}
										>
											{subTagItem.title}
										</Button>
									);
								}
							);
						}}
					/>
				);
			}

			return (
				<Button
					key={indexTagItem}
					onClick={(e) => onItemClick(tagItem.value)}
				>
					{tagItem.title}
				</Button>
			);
		});
	};
	return (
		<BlockControls>
			<Toolbar
				label="Tags"
				className={
					'components-toolbar block-editor-block-toolbar__block-controls extend-tags-controls'
				}
			>
				<Dropdown
					className="container-tags"
					contentClassName="popover-content-tags"
					popoverProps={{ placement: 'bottom-start' }}
					renderToggle={({ isOpen, onToggle }) => (
						<Button onClick={onToggle} aria-expanded={isOpen}>
							<Icon icon={plusCircle} />
						</Button>
					)}
					renderContent={() => dropdownRender()}
				/>
			</Toolbar>
		</BlockControls>
	);
};

registerFormatType(tagsFormatName, {
	title: `WC Tags`,
	tagName: 'span',
	className: `extendstudio-tags`,
	edit: TagEdit,
});
