import {
	BaseControl,
	Popover,
	Button,
	Flex,
	FlexItem,
	Tooltip,
	FlexBlock,
} from '@wordpress/components';
import LinkSelector from './url-input-wordpress';
import { __ } from '@wordpress/i18n';
// import { fetchLinkSuggestions, useOnClickOutside } from '@kubio/core';
import classnames from 'classnames';
import { select } from '@wordpress/data';
import { find, noop } from 'lodash';
import { ucwords } from '@kubio/utils';
import { createPortal, useRef, useCallback } from '@wordpress/element';
import { cog, Icon } from '@wordpress/icons';
import { EnterIcon } from '@kubio/icons';
import { useOnClickOutside } from '@kubio/utils';

const getSuggestionType = ({ type, taxonomy, block }) => {
	if (type) {
		switch (type) {
			case 'post':
				return __('Post', 'kubio');

			case 'page':
				return __('Page', 'kubio');
			default:
				return ucwords(type.replace(/[\-\_]/gi, ' '));
		}
	}

	if (taxonomy) {
		switch (taxonomy) {
			case 'post_tag':
				return __('Tag', 'kubio');

			case 'category':
				return __('Category', 'kubio');
		}
	}

	if (block) {
		const blockTypes = select('core/blocks').getBlockTypes();
		const blockType = find(blockTypes, { name: block });
		return blockType?.title || __('Unknown Block', 'kubio');
	}
};

const URLInput = ({
	label,
	value,
	onChange,
	placeholder,
	showInitialSuggestions = false,
	showSuggestionsInline = false,
	allowSettings = false,
	suggestionsPortalContainerRef = false,
	suggestionsLimit = 3,
	onClick,
	onSuggestionSelected = noop,
	autoFocus,
}) => {
	const suggestionsRef = useRef();
	const clickOutsideCallback = useRef(noop);

	const clickOutsideFunction = useCallback(() => {
		clickOutsideCallback.current();
	}, [clickOutsideCallback.current]);

	useOnClickOutside(suggestionsRef, clickOutsideFunction);

	const renderSuggestions = ({
		suggestions,
		selectedSuggestion,
		suggestionsListProps,
		closePopover,
		handleSuggestionClick,
		inputRef,
	}) => {
		clickOutsideCallback.current = closePopover;

		suggestions = suggestionsLimit
			? suggestions.slice(0, suggestionsLimit)
			: suggestions;

		const suggestionsContent = (
			<div
				{...suggestionsListProps}
				className={classnames(
					'block-editor-url-input__suggestions',
					`kubio-url-control__suggestions`
				)}
				ref={suggestionsRef}
			>
				{suggestions.map((suggestion, index) => (
					<Button
						key={index}
						className={classnames('kubio-url-control__suggestion', {
							'is-selected': index === selectedSuggestion,
						})}
						onClick={() => {
							handleSuggestionClick(suggestion);
							onSuggestionSelected(suggestion);
						}}
					>
						<Flex>
							<FlexBlock>
								<Flex
									justify={'start'}
									className={
										'kubio-url-control__suggestion_title-wrapper'
									}
								>
									<FlexItem
										className={
											'kubio-url-control__suggestion_title'
										}
									>
										{suggestion.title}
									</FlexItem>
									<FlexItem
										className={
											'kubio-url-control__suggestion_type'
										}
									>
										({getSuggestionType(suggestion)})
									</FlexItem>
								</Flex>
								<div
									className={
										'kubio-url-control__suggestion_url'
									}
								>
									<Tooltip text={suggestion.url}>
										<span>{suggestion.url}</span>
									</Tooltip>
								</div>
							</FlexBlock>
							<FlexItem>
								<Icon icon={EnterIcon} width={12} />
							</FlexItem>
						</Flex>
					</Button>
				))}
			</div>
		);

		if (suggestionsPortalContainerRef) {
			return createPortal(
				suggestionsContent,
				suggestionsPortalContainerRef.current
			);
		}

		if (showSuggestionsInline) {
			return suggestionsContent;
		}

		return (
			<Popover
				className={'kubio-url-control__popover'}
				position="bottom"
				anchorRef={inputRef?.current}
				noArrow
				focusOnMount={false}
			>
				{suggestionsContent}
			</Popover>
		);
	};

	/* eslint-disable jsx-a11y/no-autofocus */
	return (
		<BaseControl
			className={classnames(
				'kubio-url-control-container',
				'kubio-control'
			)}
		>
			{typeof label !== 'undefined' ? (
				<BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
			) : (
				''
			)}
			<div className="kubio-url-control-input-container">
				<LinkSelector
					autoFocus={autoFocus}
					className={'kubio-url-control'}
					value={value}
					onChange={onChange}
					placeholder={
						placeholder ?? __('Search or type url', 'kubio')
					}
					__experimentalHandleURLSuggestions={true}
					// __experimentalFetchLinkSuggestions={fetchLinkSuggestions}
					__experimentalShowInitialSuggestions={
						showInitialSuggestions
					}
					__experimentalRenderSuggestions={renderSuggestions}
				/>

				{allowSettings && (
					<Button
						isSmall
						icon={cog}
						className={'kubio-input-wrapper-button'}
						onClick={onClick}
					/>
				)}
			</div>
		</BaseControl>
	);
	/* eslint-enable jsx-a11y/no-autofocus */
};

export { URLInput };
