import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import isEqual from 'react-fast-compare';

const useDeepCompareMemoize = (value = []) => {
	const ref = useRef([]);
	if (!isEqual(ref.current, value)) {
		ref.current = value;
	}
	return ref.current;
};

//react's use memo compares references for array/objects because of this we use a ref to store the current reference
//and only change the reference when the value of the object changes using a deep compare method.
const useDeepMemo = (callback, dependencies) => {
	const memoisedDependencies = useDeepCompareMemoize(dependencies);
	return useMemo(callback, memoisedDependencies);
};

const useEffectDeep = (callback, dependencies) => {
	const memoisedDependencies = useDeepCompareMemoize(dependencies);
	return useEffect(callback, memoisedDependencies);
};

const useDeepCallback = (callback, dependencies) => {
	const memoisedDependencies = useDeepCompareMemoize(dependencies);
	return useCallback(callback, memoisedDependencies);
};

//this is the same same as useState the only differences are that the value changes instantly and when you are using the
//value you need to use with  ".current" to get the current data.
//The setter also forces a refresh so the component rerenders
const useInstantState = (initialState) => {
	const stateRef = useRef(initialState);
	const [forceRefreshState, setForceRefreshState] = useState();

	const onForceRefresh = useCallback(() => {
		setForceRefreshState(Math.random());
	}, [setForceRefreshState]);

	const onChangeState = useCallback(
		(newValue) => {
			stateRef.current = newValue;
			onForceRefresh();
		},
		[stateRef, onForceRefresh]
	);

	return [stateRef, onChangeState, forceRefreshState];
};

export { useDeepMemo, useDeepCallback, useEffectDeep, useInstantState };
