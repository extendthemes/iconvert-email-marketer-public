/**
 * External dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { __experimentalSanitizeBlockAttributes } from '@wordpress/blocks';
import { Placeholder } from '@wordpress/components';
/**
 * WordPress dependencies
 */
import { useDebounce, usePrevious } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { RawHTML, useEffect, useRef, useState } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { noop } from 'lodash';
import isEqual from 'react-fast-compare';

const Spinner = () => {
	const backgroundImage = useSelect((select) => {
		const { siteUrl } = select('core/block-editor').getSettings();
		return `url('${siteUrl}/wp-admin/images/spinner.gif')`;
	}, []);

	const style = {
		backgroundImage,
	};

	return <span className="h-block-placeholder__spinner" style={style} />;
};

export function rendererPath(block, attributes = null, urlQueryArgs = {}) {
	return addQueryArgs(`/wp/v2/block-renderer/${block}`, {
		context: 'edit',
		...(null !== attributes ? { attributes } : {}),
		...urlQueryArgs,
	});
}

function DefaultEmptyResponsePlaceholder({ className }) {
	return (
		<Placeholder className={className}>
			{__('Block rendered as empty.', 'kubio')}
		</Placeholder>
	);
}

function DefaultErrorResponsePlaceholder({ response, className }) {
	const errorMessage = sprintf(
		// translators: %s: error message describing the problem
		__('Error loading block: %s', 'kubio'),
		response.errorMsg
	);
	return <Placeholder className={className}>{errorMessage}</Placeholder>;
}

function DefaultLoadingResponsePlaceholder({
	className,
	message = __('Loading…', 'kubio'),
}) {
	return (
		<Placeholder className={className}>
			<Spinner />
			<span>{message}</span>
		</Placeholder>
	);
}

export default function ServerSideRender(props) {
	const {
		attributes,
		block,
		className,
		httpMethod = 'POST',
		urlQueryArgs,
		onChange = noop,
		EmptyResponsePlaceholder = DefaultEmptyResponsePlaceholder,
		ErrorResponsePlaceholder = DefaultErrorResponsePlaceholder,
		LoadingResponsePlaceholder = DefaultLoadingResponsePlaceholder,
	} = props;
	const fetchDataDependecy = {
		attributes,
		block,
		httpMethod,
		urlQueryArgs,
	};
	const isMountedRef = useRef(true);
	const shouldDebounceFetch = useRef(false);
	const fetchRequestRef = useRef();

	const [response, setResponse] = useState(null);
	const loadingCountDown = useRef(null);
	const prevData = usePrevious(fetchDataDependecy);

	function stopLoadingCountDown() {
		if (loadingCountDown.current) {
			clearTimeout(loadingCountDown.current);
		}
	}

	function startLoadingCountDown() {
		stopLoadingCountDown();
		loadingCountDown.current = setTimeout(() => {
			setResponse(null);
		}, 2000);
	}

	function fetchData() {
		if (shouldDebounceFetch.current) {
			shouldDebounceFetch.current = false;
		}

		if (!isMountedRef.current) {
			return;
		}
		if (null !== response) {
			startLoadingCountDown();
		}

		const sanitizedAttributes =
			attributes &&
			__experimentalSanitizeBlockAttributes(block, attributes);

		// If httpMethod is 'POST', send the attributes in the request body instead of the URL.
		// This allows sending a larger attributes object than in a GET request, where the attributes are in the URL.
		const isPostRequest = 'POST' === httpMethod;
		const urlAttributes = isPostRequest
			? null
			: sanitizedAttributes ?? null;
		const path = rendererPath(block, urlAttributes, urlQueryArgs);
		const data = isPostRequest
			? { attributes: sanitizedAttributes ?? null }
			: null;

		// Store the latest fetch request so that when we process it, we can
		// check if it is the current request, to avoid race conditions on slow networks.
		const fetchRequest = (fetchRequestRef.current = apiFetch({
			path,
			data,
			method: isPostRequest ? 'POST' : 'GET',
		})
			.then((fetchResponse) => {
				if (
					isMountedRef.current &&
					fetchRequest === fetchRequestRef.current &&
					fetchResponse
				) {
					stopLoadingCountDown();
					setResponse(fetchResponse.rendered);
				}
			})
			.catch((error) => {
				if (
					isMountedRef.current &&
					fetchRequest === fetchRequestRef.current
				) {
					stopLoadingCountDown();
					setResponse({
						error: true,
						errorMsg: error.message,
					});
				}
			}));

		return fetchRequest;
	}
	const debouncedFetchData = useDebounce(fetchData, 400);

	// When the component unmounts, set isMountedRef to false. This will
	// let the async fetch callbacks know when to stop.
	useEffect(
		() => () => {
			isMountedRef.current = false;
		},
		[]
	);

	useEffect(() => {
		if (shouldDebounceFetch.current) {
			debouncedFetchData();
			return;
		}
		// Don't debounce the first fetch. This ensures that the first render
		// shows data as soon as possible
		if (prevData === undefined) {
			fetchData();
		} else if (!isEqual(prevData, fetchDataDependecy)) {
			debouncedFetchData();
			shouldDebounceFetch.current = true;
		}
	});

	useEffect(() => {
		onChange();
	}, [response]);

	if (response === '') {
		return <EmptyResponsePlaceholder {...props} />;
	} else if (!response) {
		return <LoadingResponsePlaceholder {...props} />;
	} else if (response.error) {
		return <ErrorResponsePlaceholder response={response} {...props} />;
	}

	return <RawHTML className={className}>{response}</RawHTML>;
}
