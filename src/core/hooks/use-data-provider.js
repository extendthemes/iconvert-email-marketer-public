import { useCallback, useContext } from '@wordpress/element';
import _ from 'lodash';
import { DataProvider } from '../../blocks/blocks';

export const useBlockData = ( _element = '' ) => {
	const { blockJson, attributes, setAttributes } = useContext( DataProvider );
	const currentStyle = `_style${
		( _element || '' ).charAt( 0 ).toUpperCase() + _element.slice( 1 )
	}`;

	const onResetBlock = useCallback(
		( path ) => () => {
			const currentPath = `attributes._styleBlock.default.${ path }`;
			const defaultValue = _.get( blockJson, currentPath );
			const _styleBlock = _.cloneDeep( attributes?._styleBlock );
			_.set( _styleBlock, path, defaultValue );

			setAttributes( { _styleBlock } );
		},
		[ blockJson, attributes, setAttributes ]
	);
	const onReset = useCallback(
		( path ) => () => {
			const currentPath = `attributes.${ currentStyle }.default.${ path }`;
			const defaultValue = _.get( blockJson, currentPath );
			const _style = _.cloneDeep( attributes[ currentStyle ] || {} );
			_.set( _style, path, defaultValue );

			const tmpStyle = {};
			tmpStyle[ currentStyle ] = _style;

			setAttributes( { ...tmpStyle } );
		},
		[ blockJson, attributes, setAttributes ]
	);

	const getValueBlock = ( path, fallback ) => {
		const { _styleBlock } = attributes;

		return _.get( _styleBlock, path, fallback );
	};

	const getValue = ( path, fallback ) => {
		const _style = attributes[ currentStyle ] || {};

		return _.get( _style, path, fallback );
	};

	const onChangeBlock = ( path ) => ( newValue ) => {
		const _styleBlock = _.cloneDeep( attributes?._styleBlock );
		if ( typeof newValue === 'object' ) {
			_.set(
				_styleBlock,
				path,
				_.merge( _.get( _styleBlock, path ), newValue )
			);
		} else {
			_.set( _styleBlock, path, newValue );
		}
		setAttributes( { _styleBlock } );
	};
	const onChange = ( path ) => ( newValue ) => {
		const _style = _.cloneDeep( attributes[ currentStyle ] || {} );
		if ( typeof newValue === 'object' ) {
			_.set( _style, path, _.merge( _.get( _style, path ), newValue ) );
		} else {
			_.set( _style, path, newValue );
		}

		const tmpStyle = {};
		tmpStyle[ currentStyle ] = _style;

		setAttributes( { ...tmpStyle } );
	};

	return ( path, isBlockStyle = false, fallback = '' ) => {
		return isBlockStyle
			? {
					value: getValueBlock( path, fallback ),
					onChange: onChangeBlock( path ),
					onReset: onResetBlock( path ),
			  }
			: {
					value: getValue( path, fallback ),
					onChange: onChange( path ),
					onReset: onReset( path ),
			  };
	};
};
