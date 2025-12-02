import { DeleteItemIcon, DuplicateItemIcon } from "@kubio/icons";
import {
	createRef,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "@wordpress/element";
import { dragHandle, Icon } from "@wordpress/icons";
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from "react-accessible-accordion";
import classnames from "classnames";
import { cloneDeep, difference, identity, isEqual, noop } from "lodash";
import {
	SortableContainer,
	SortableElement,
	SortableHandle,
} from "react-sortable-hoc";
import {
	BaseControl,
	Button,
	ToggleControl,
	Tooltip,
} from "@wordpress/components";
import { CanvasIcon } from "../canvas-icon";
import { stripTags } from "@kubio/utils";

const DragHandle = SortableHandle(() => (
	<Icon icon={dragHandle} className={"draggable-item"} />
));

const SortableItem = SortableElement(
	({
		item,
		itemIndex,
		nrItems,
		headingRenderer,
		contentRendered,
		accordionItemProps,
		accordionHeadinProps,
		accordionButtonProps,
		accordionContentProp = {},
		onDelete,
		onDuplicate,
		onSelect,
		onToggleTarget,
		toggleTarget,
		allowDuplicate,
		allowDelete,
		activeItems,
		setActiveItems,
		allowMultipleExpanded,
		isSimpleAccordion,
		sortDisable,
		tooltip = true,
	}) => {
		const onStopPropagation = (event) => {
			event.preventDefault();
			event.stopPropagation();
			event.nativeEvent.stopImmediatePropagation();
		};
		const isActive = useMemo(
			() => activeItems.includes(item.id),
			[activeItems, item]
		);

		const getAccordionItemClasses = () => {
			const classes = ["accordion__item"];
			if (isActive && !isSimpleAccordion) {
				classes.push("accordion__item__is_opened");
			}
			if (item.isSelected) {
				classes.push("is-selected");
			}
			if (item.forcehide) {
				classes.push("h-force-hide");
			}
			return classes.join(" ");
		};

		const toggleItem = useCallback(() => {
			if (activeItems.includes(item.id)) {
				setActiveItems(difference(activeItems, [item.id]));
			} else if (allowMultipleExpanded) {
				setActiveItems([...activeItems, item.id]);
			} else {
				setActiveItems([item.id]);
			}

			onSelect(item);
		}, [setActiveItems, item, onSelect, activeItems]);
		return (
			<AccordionItem
				uuid={item.id}
				className={getAccordionItemClasses()}
				{...accordionItemProps}
				dangerouslySetExpanded={isActive}
			>
				<AccordionItemHeading {...accordionHeadinProps}>
					<AccordionItemButton {...accordionButtonProps}>
						{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
						<div role={"button"} tabIndex={-1} onClick={toggleItem}>
							<div className={"kubio-sortable-accordion-title"}>
								<div className="kubio-sortable-accordion-info">
									{!sortDisable && <DragHandle />}

									{tooltip ? (
										<Tooltip text={headingRenderer(item)}>
											<div className={"kubio-sortable-accordion-title__text"}>
												{headingRenderer(item, itemIndex)}
											</div>
										</Tooltip>
									) : (
										<div className={"kubio-sortable-accordion-title__text"}>
											{headingRenderer(item, itemIndex)}
										</div>
									)}
								</div>
								<div className="kubio-sortable-acordion-icon-container">
									{allowDuplicate && (
										<Button
											isSmall
											icon={DuplicateItemIcon}
											iconSize={20}
											className={"kubio-sortable-acordion-icon"}
											onClick={(event) => {
												onStopPropagation(event);
												onDuplicate(item.id, false, {
													...item,
												});
											}}
										/>
									)}
									{allowDelete && nrItems > 1 && (
										<Button
											isSmall
											icon={DeleteItemIcon}
											iconSize={20}
											className={"kubio-sortable-acordion-icon"}
											onClick={(event) => {
												onStopPropagation(event);
												onDelete(item, itemIndex);
											}}
										/>
									)}
									{toggleTarget && (
										// eslint-disable-next-line jsx-a11y/click-events-have-key-events
										<div
											role={"button"}
											tabIndex={-1}
											className="toggle-control-wrapper"
											onClick={(event) => {
												event.stopPropagation();
											}}
										>
											<ToggleControl
												onChange={(event) => {
													onToggleTarget(item, event, itemIndex);
												}}
												checked={item[toggleTarget]}
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					</AccordionItemButton>
				</AccordionItemHeading>
				{contentRendered && typeof contentRendered === "function" && (
					<AccordionItemPanel {...accordionContentProp}>
						{contentRendered(item, itemIndex, isActive)}
					</AccordionItemPanel>
				)}
			</AccordionItem>
		);
	}
);

const SortableList = SortableContainer((props) => {
	const {
		items = [],
		headingRenderer = noop,
		contentRendered = null,
		accordionProps = {},
		accordionItemProps = {},
		accordionHeadinProps = {},
		accordionButtonProps = {},
		accordionContentProps = {},
		onDelete = noop,
		onDuplicate = noop,
		onSelect = noop,
		onToggleTarget,
		toggleTarget = false,
		allowDuplicate,
		allowDelete,
		isSimpleAccordion,
		activeItems: initialActiveItems = null,
		allowMultipleExpanded = false,
		sortDisable = false,
		tooltip = true,
	} = props;
	const initialState = initialActiveItems !== null ? initialActiveItems : [];
	const [activeItems, setActiveItems] = useState(initialState);

	useEffect(() => {
		//we check if the initialActiveItems is null to know if the activeItems are managed by the block or are only
		//internally managed. If the items are managed by the block the initialValue will be an array if not the default value
		//of null will be present
		if (
			initialActiveItems?.length &&
			difference(initialActiveItems, activeItems)
		) {
			setActiveItems(initialActiveItems);
		}
	}, [initialActiveItems]);

	const nrItems = items.length;

	return (
		<Accordion allowZeroExpanded={true} {...accordionProps}>
			{items.map((item, index) => (
				<SortableItem
					key={item.id}
					index={index}
					item={item}
					nrItems={nrItems}
					itemIndex={index}
					activeItems={activeItems}
					setActiveItems={setActiveItems}
					allowMultipleExpanded={allowMultipleExpanded}
					contentRendered={contentRendered}
					headingRenderer={headingRenderer}
					accordionItemProps={accordionItemProps}
					accordionHeadinProps={accordionHeadinProps}
					accordionButtonProps={accordionButtonProps}
					accordionContentProps={accordionContentProps}
					onDelete={onDelete}
					onToggleTarget={onToggleTarget}
					toggleTarget={toggleTarget}
					onDuplicate={onDuplicate}
					onSelect={onSelect}
					allowDuplicate={allowDuplicate}
					allowDelete={allowDelete}
					isSimpleAccordion={isSimpleAccordion}
					disabled={sortDisable}
					sortDisable={sortDisable}
					tooltip={tooltip}
				/>
			))}
		</Accordion>
	);
});
const headingRendererFallback = (item) => {
	return stripTags(item?.title);
};

const SortableAccordion = (props = {}) => {
	const defaultProps = {
		items: [],
		headingRenderer: headingRendererFallback,
		contentRendered: null,
		accordionProps: {},
		accordionItemProps: {},
		accordionHeadinProps: {},
		accordionButtonProps: {},
		accordionContentProps: {},
		onDelete: noop,
		onDuplicate: noop,
		onSortEnd: noop,
		onToggleTarget: null,
		toggleTarget: false,
		allowDuplicate: true,
		allowDelete: true,
		lockAxis: "y",
		sortDisable: false,
		tooltip: true,
	};
	const listProps = {
		...defaultProps,
		...props,
		useDragHandle: true,
	};

	const $el = createRef();
	const isSimpleAccordion = !listProps.contentRendered;

	const helperContainer = () => {
		return $el.current;
	};

	return (
		<BaseControl className="kubio-control">
			<div
				className={classnames(["kubio-sortable-accordion"], {
					"kubio-sortable-accordion--simple": isSimpleAccordion,
				})}
				ref={$el}
			>
				<SortableList
					{...listProps}
					isSimpleAccordion={isSimpleAccordion}
					helperClass={"kubio-sortable-accordion-list"}
					helperContainer={helperContainer}
					tooltip={listProps.tooltip}
				/>
			</div>
		</BaseControl>
	);
};

const ManagedSortableAccordion = ({
	value = [],
	onChange = noop,
	onItemDuplicate = identity,
	headingRenderer = null,
	contentRendered = null,
	allowDuplicate = true,
	allowDelete = true,
}) => {
	const [items, setItems] = useState(value);
	const updateItems = (nextItems) => {
		setItems(nextItems);
		onChange(nextItems);
	};

	useEffect(() => {
		if (!isEqual(value, items)) {
			setItems(value);
		}
	}, [value, items]);

	const onDelete = useCallback(
		(item, index) => {
			const newItems = [...items];
			newItems.splice(index, 1);
			updateItems(newItems);
		},
		[items]
	);

	const onDuplicate = useCallback(
		(index) => {
			const newItems = [...items];
			const itemToDuplicateIndex = index;
			const newItem = onItemDuplicate(
				cloneDeep(newItems[itemToDuplicateIndex])
			);
			newItems.splice(itemToDuplicateIndex + 1, 0, newItem);
			updateItems(newItems);
		},
		[items, onItemDuplicate]
	);

	const onSortEnd = useCallback(
		({ newIndex, oldIndex }) => {
			const newItems = [...items];
			const item = newItems.splice(oldIndex, 1)[0];
			newItems.splice(newIndex, 0, item);
			updateItems(newItems);
		},
		[items]
	);

	const updateItem = useCallback(
		(nextItem, index) => {
			let newItems = [...items];
			newItems[index] = nextItem;
			updateItems(newItems);
		},
		[items]
	);

	const itemHeadingRender = (item, index) => {
		return headingRenderer(item.itemData, index);
	};

	const itemRender = useMemo(() => {
		if (!contentRendered) {
			return null;
		}

		return (item, index) => {
			const updateCurrentItem = (nextItem) => updateItem(nextItem, index);
			return contentRendered(updateCurrentItem, item.itemData, index);
		};
	}, [contentRendered, updateItem]);

	const itemsMap = useMemo(() => {
		return items.map((item, index) => ({ id: index, itemData: item }));
	}, [items]);

	return (
		<SortableAccordion
			items={itemsMap}
			onDelete={onDelete}
			onDuplicate={onDuplicate}
			onSortEnd={onSortEnd}
			headingRenderer={itemHeadingRender}
			contentRendered={itemRender}
			allowDuplicate={allowDuplicate}
			allowDelete={allowDelete}
		/>
	);
};

const ManagerSortableList = ({
	value = [],
	onChange = noop,
	onItemDuplicate = identity,
	headingRenderer = null,
	allowDuplicate = true,
	allowDelete = true,
}) => {
	const [items, setItems] = useState(value);
	const updateItems = (nextItems) => {
		setItems(nextItems);
		onChange(nextItems);
	};

	useEffect(() => {
		if (!isEqual(value, items)) {
			setItems(value);
		}
	}, [value, items]);

	const onDelete = useCallback(
		(item, index) => {
			const newItems = [...items];
			newItems.splice(index, 1);
			updateItems(newItems);
		},
		[items]
	);

	const onDuplicate = useCallback(
		(index) => {
			const newItems = [...items];
			const itemToDuplicateIndex = index;
			const newItem = onItemDuplicate(
				cloneDeep(newItems[itemToDuplicateIndex])
			);
			newItems.splice(itemToDuplicateIndex + 1, 0, newItem);
			updateItems(newItems);
		},
		[items, onItemDuplicate]
	);

	const onSortEnd = useCallback(
		({ newIndex, oldIndex }) => {
			const newItems = [...items];
			const item = newItems.splice(oldIndex, 1)[0];
			newItems.splice(newIndex, 0, item);
			updateItems(newItems);
		},
		[items]
	);

	const itemHeadingRender = (item, index) => {
		return headingRenderer(item.itemData, index);
	};

	const itemsMap = useMemo(() => {
		return items.map((item, index) => ({ id: index, itemData: item }));
	}, [items]);

	return (
		<SortableAccordion
			items={itemsMap}
			onDelete={onDelete}
			onDuplicate={onDuplicate}
			onSortEnd={onSortEnd}
			headingRenderer={itemHeadingRender}
			allowDuplicate={allowDuplicate}
			allowDelete={allowDelete}
		/>
	);
};

export { SortableAccordion, ManagedSortableAccordion, ManagerSortableList };
export default SortableAccordion;
